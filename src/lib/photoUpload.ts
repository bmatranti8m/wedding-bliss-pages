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
export const MAX_INPUT_BYTES = 25 * 1024 * 1024; // reject originals larger than 25 MB
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
  uploaderName: string;
}

async function postOnce({ blob, filename, uploaderName }: UploadArgs): Promise<UploadResult> {
  const data = await blobToBase64(blob);
  const params = new URLSearchParams();
  params.append("data", data);
  params.append("filename", filename);
  params.append("mimeType", "image/jpeg");
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
