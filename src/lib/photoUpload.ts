// Guest photo upload helpers.
//
// Pipeline per file: resize/re-encode (orientation-corrected) -> base64 ->
// POST to the Apps Script web app, which saves it to a Google Drive folder.
//
// Deploy the script in google-apps-script/photo-upload.gs, then paste its
// /exec URL below. If you set a SECRET in that script, mirror it here.
export const PHOTO_UPLOAD_URL = "https://script.google.com/macros/s/AKfycbwnQnUgiVnEyvnxvm3TcLE4ZjjLHpJ9MRDqiN3g1N0Y5E34_kkqeXH-uKjB4rjTOW0qZQ/exec";
export const UPLOAD_SECRET = "c7ae3b010057fb84407c3d79"; // must match SECRET in photo-upload.gs (or "" to disable)

export const MAX_FILES = 20;
export const MAX_INPUT_BYTES = 25 * 1024 * 1024; // reject original images larger than 25 MB
// Videos have no size cap: instead of squeezing them through the Apps Script
// POST body (limited to ~50 MB), the script mints a Google Drive resumable
// upload session and the browser streams the file straight to Drive.
export const MAX_EDGE = 2560; // longest edge after resize (px)
export const JPEG_QUALITY = 0.82;

export interface UploadResult {
  ok: boolean;
  unconfirmed?: boolean; // delivered but the response could not be read (likely succeeded)
  error?: string;
}

/** True for HEIC/HEIF files, which browsers cannot decode to a canvas. */
export function isHeic(file: File): boolean {
  return (
    /image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)
  );
}

/** True for video files, which we upload as-is (no resize/re-encode). */
export function isVideo(file: File): boolean {
  return (
    /^video\//i.test(file.type) ||
    /\.(mp4|mov|m4v|webm|ogg|3gp|avi|mkv)$/i.test(file.name)
  );
}

/** Encode a Blob to base64 (no data-URL prefix), chunked to avoid stack overflow. */
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function scaledSize(width: number, height: number) {
  const longest = Math.max(width, height);
  if (longest <= MAX_EDGE) return { width, height };
  const scale = MAX_EDGE / longest;
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to encode image"))),
      "image/jpeg",
      JPEG_QUALITY
    );
  });
}

/** Resize & re-encode to JPEG with EXIF orientation applied. */
export async function resizeImage(file: File): Promise<Blob> {
  // Preferred path: createImageBitmap applies EXIF orientation for us.
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      } as ImageBitmapOptions);
      const { width, height } = scaledSize(bitmap.width, bitmap.height);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      return await canvasToJpeg(canvas);
    } catch {
      // fall through to <img> path
    }
  }

  // Fallback: <img> -> canvas. Modern browsers honor EXIF orientation on <img>.
  return new Promise<Blob>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
      try {
        const { width, height } = scaledSize(img.naturalWidth, img.naturalHeight);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(await canvasToJpeg(canvas));
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}

interface UploadArgs {
  blob: Blob;
  filename: string;
  mimeType: string;
  uploaderName: string;
}

async function postOnce({ blob, filename, mimeType, uploaderName }: UploadArgs): Promise<UploadResult> {
  const data = await blobToBase64(blob);
  const params = new URLSearchParams();
  params.append("data", data);
  params.append("filename", filename);
  params.append("mimeType", mimeType);
  params.append("uploaderName", uploaderName || "guest");
  params.append("timestamp", new Date().toLocaleString("ro-RO"));
  if (UPLOAD_SECRET) params.append("secret", UPLOAD_SECRET);

  // application/x-www-form-urlencoded keeps this a CORS "simple request"
  // (no preflight), so the Apps Script JSON response is readable.
  const res = await fetch(PHOTO_UPLOAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    redirect: "follow",
  });
  const json = (await res.json()) as { ok: boolean; error?: string };
  return json.ok ? { ok: true } : { ok: false, error: json.error };
}

/**
 * Upload one already-resized photo, with a single retry. If the network/CORS
 * layer throws (response unreadable), the file has very likely arrived — we
 * report `unconfirmed` rather than a hard failure. Timestamped filenames make
 * an accidental duplicate from a retry harmless.
 */
export async function uploadPhoto(args: UploadArgs): Promise<UploadResult> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await postOnce(args);
    } catch (err) {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }
      // Couldn't read the response after retrying — treat as delivered-but-unconfirmed.
      return { ok: true, unconfirmed: true };
    }
  }
  return { ok: false, error: "Upload failed" };
}

// ---------------------------------------------------------------------------
// Video upload — resumable, straight to Google Drive (no size limit).
//
// Step 1: ask the Apps Script (secret-protected) to open a Drive resumable
//   upload session for this file. The script does this server-side with the
//   couple's credentials and returns only the one-time session URL — no token
//   is ever exposed to the browser.
// Step 2: the browser streams the raw file bytes to that session URL. The
//   upload_id embedded in the URL is the capability, so the PUT needs no auth
//   header and isn't bound by the Apps Script POST-body size limit.
// ---------------------------------------------------------------------------

interface VideoUploadArgs {
  file: File;
  uploaderName: string;
  onProgress?: (fraction: number) => void;
}

async function startVideoSession(file: File, uploaderName: string): Promise<string> {
  const params = new URLSearchParams();
  params.append("action", "video-init");
  params.append("filename", file.name);
  params.append("mimeType", file.type || "video/mp4");
  params.append("uploaderName", uploaderName || "guest");
  params.append("timestamp", new Date().toLocaleString("ro-RO"));
  // The Drive upload session only allows cross-origin PUTs from the origin it
  // was opened for, so tell the script which origin will stream the bytes.
  params.append("origin", window.location.origin);
  if (UPLOAD_SECRET) params.append("secret", UPLOAD_SECRET);

  const res = await fetch(PHOTO_UPLOAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    redirect: "follow",
  });
  const json = (await res.json()) as { ok: boolean; uploadUrl?: string; error?: string };
  if (!json.ok || !json.uploadUrl) {
    throw new Error(json.error || "Could not start the video upload.");
  }
  return json.uploadUrl;
}

/** PUT the whole file to the resumable session URL, reporting byte progress. */
function putToSession(
  uploadUrl: string,
  file: File,
  onProgress?: (fraction: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
    // A single PUT covering the whole file completes the resumable session.
    xhr.setRequestHeader("Content-Range", `bytes 0-${file.size - 1}/${file.size}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(1);
        resolve();
      } else {
        reject(new Error(`Upload failed (HTTP ${xhr.status}).`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onabort = () => reject(new Error("Upload was cancelled."));
    xhr.send(file);
  });
}

export async function uploadVideo({ file, uploaderName, onProgress }: VideoUploadArgs): Promise<UploadResult> {
  try {
    const uploadUrl = await startVideoSession(file, uploaderName);
    await putToSession(uploadUrl, file, onProgress);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
