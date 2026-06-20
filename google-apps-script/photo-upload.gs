/**
 * Guest Photo/Video Upload — Google Apps Script Web App
 * ------------------------------------------------------
 * Receives photos and videos (base64) from the website's /upload page and
 * saves them into a Google Drive folder owned by the couple. Files are NOT
 * shown back on the site — this is a private collection.
 *
 * Photos travel base64-encoded inside the POST body and are saved directly.
 * Videos can be any size: the script opens a Drive *resumable upload session*
 * (action=video-init) and returns only the one-time session URL, which the
 * browser streams the bytes to — bypassing Apps Script's ~50 MB POST limit.
 *
 * This file is a REFERENCE ONLY. It is not bundled or deployed by the site.
 * Copy its contents into a new Apps Script project at https://script.google.com.
 *
 * ====================== ONE-TIME SETUP ======================
 * 1. In Google Drive, create a folder for the photos. Open it and copy the ID
 *    from the URL:  drive.google.com/drive/folders/<THIS_IS_THE_ID>
 * 2. Go to https://script.google.com → New project. Paste this whole file.
 * 3. Set FOLDER_ID below to your folder's ID.
 * 4. (Recommended) Set SECRET below to a random string, and put the SAME value
 *    in UPLOAD_SECRET in src/lib/photoUpload.ts. This deters random uploads to
 *    the public endpoint. Leave SECRET = '' to disable the check.
 * 5. Run the `doGet` function once from the editor to trigger the
 *    authorization prompt, and grant access. (Video support also needs the
 *    "connect to an external service" permission — if you added it to an
 *    existing project, run a function once more to re-grant.)
 * 6. Deploy → New deployment → type: "Web app".
 *      - Description: anything
 *      - Execute as:  Me   (the account that owns the Drive folder)
 *      - Who has access:  Anyone   (guests are not signed in)
 * 7. Copy the resulting Web app URL (ends in /exec) into PHOTO_UPLOAD_URL in
 *    src/lib/photoUpload.ts.
 * 8. Generate a QR code pointing to https://bogdanandcorina.com/upload
 *
 * NOTE: After ANY edit to this script you must redeploy a NEW version
 * (Deploy → Manage deployments → Edit → Version: New version), otherwise
 * the old code keeps running.
 */

// ========================= CONFIG =========================
var FOLDER_ID = '1J6644F3OC1OSk1747tADAYDkafh4FCBH';
var SECRET = 'c7ae3b010057fb84407c3d79'; // shared secret; must match UPLOAD_SECRET on the client
var MAX_BASE64_LENGTH = 30 * 1024 * 1024; // ~22 MB decoded guard for the base64 image path
var DRIVE_TIMEZONE = 'Europe/Bucharest';
// =========================================================

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return jsonOut({ ok: false, error: 'No payload received.' });
    }

    if (SECRET && e.parameter.secret !== SECRET) {
      return jsonOut({ ok: false, error: 'Unauthorized.' });
    }

    // Videos don't fit through this POST body, so they ask for a Drive
    // resumable upload session and stream the bytes directly to Drive.
    if (e.parameter.action === 'video-init') {
      return startVideoSession(e);
    }

    var data = e.parameter.data || '';
    var filename = sanitizeName(e.parameter.filename || 'photo.jpg');
    var mimeType = e.parameter.mimeType || 'application/octet-stream';
    var uploaderName = sanitizeName(e.parameter.uploaderName || 'guest');
    var clientTimestamp = e.parameter.timestamp || '';

    if (!data) {
      return jsonOut({ ok: false, error: 'Missing file data.' });
    }
    if (data.length > MAX_BASE64_LENGTH) {
      return jsonOut({ ok: false, error: 'File too large.' });
    }
    if (mimeType.indexOf('image/') !== 0) {
      return jsonOut({ ok: false, error: 'Unsupported file type: ' + mimeType });
    }

    var bytes = Utilities.base64Decode(data);
    var blob = Utilities.newBlob(bytes, mimeType, filename);

    var stamp = Utilities.formatDate(new Date(), DRIVE_TIMEZONE, 'yyyy-MM-dd_HH-mm-ss');
    var finalName = stamp + '__' + uploaderName + '__' + filename;
    blob.setName(finalName);

    var folder = DriveApp.getFolderById(FOLDER_ID);
    var file = folder.createFile(blob);

    return jsonOut({
      ok: true,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      name: finalName,
      uploader: uploaderName,
      clientTimestamp: clientTimestamp
    });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/**
 * Open a Google Drive resumable upload session for a video and return only the
 * one-time session URL. The browser then streams the file's bytes to that URL
 * — no access token ever leaves the server, and there's no size limit.
 */
function startVideoSession(e) {
  var mimeType = e.parameter.mimeType || 'video/mp4';
  if (mimeType.indexOf('video/') !== 0) {
    return jsonOut({ ok: false, error: 'Unsupported file type: ' + mimeType });
  }

  var filename = sanitizeName(e.parameter.filename || 'video.mp4');
  var uploaderName = sanitizeName(e.parameter.uploaderName || 'guest');
  var stamp = Utilities.formatDate(new Date(), DRIVE_TIMEZONE, 'yyyy-MM-dd_HH-mm-ss');
  var finalName = stamp + '__' + uploaderName + '__' + filename;

  // Echo the caller's origin so Drive enables CORS for the browser's PUT.
  var origin = e.parameter.origin || '';
  var fetchHeaders = {
    Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
    'X-Upload-Content-Type': mimeType
  };
  if (/^https?:\/\/[^\s]+$/.test(origin)) {
    fetchHeaders.Origin = origin;
  }

  var metadata = { name: finalName, parents: [FOLDER_ID], mimeType: mimeType };
  var res = UrlFetchApp.fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
    {
      method: 'post',
      contentType: 'application/json; charset=UTF-8',
      headers: fetchHeaders,
      payload: JSON.stringify(metadata),
      muteHttpExceptions: true
    }
  );

  if (res.getResponseCode() !== 200) {
    return jsonOut({ ok: false, error: 'Could not open upload session: ' + res.getContentText() });
  }

  var headers = res.getAllHeaders();
  var uploadUrl = headers['Location'] || headers['location'];
  if (!uploadUrl) {
    return jsonOut({ ok: false, error: 'Upload session URL missing from Drive response.' });
  }

  return jsonOut({ ok: true, uploadUrl: uploadUrl, name: finalName });
}

// Lets you confirm the deployment is live by visiting the /exec URL in a browser.
function doGet() {
  return jsonOut({ ok: true, status: 'photo-upload endpoint live' });
}

function sanitizeName(s) {
  return String(s)
    .replace(/[\/\\\?%\*:\|"<>]/g, '_') // strip filesystem-hostile characters
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
