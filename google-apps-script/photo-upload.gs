/**
 * Guest Photo Upload — Google Apps Script Web App
 * ------------------------------------------------
 * Receives photos (base64) from the website's /upload page and saves them
 * into a Google Drive folder owned by the couple. Files are NOT shown back
 * on the site — this is a private collection.
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
 * 5. Run the `doGet` function once from the editor to trigger the Drive
 *    authorization prompt, and grant access.
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
var ALLOWED_MIME_PREFIX = 'image/'; // only accept images
var MAX_BASE64_LENGTH = 30 * 1024 * 1024; // ~22 MB decoded guard per file
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
    if (ALLOWED_MIME_PREFIX && mimeType.indexOf(ALLOWED_MIME_PREFIX) !== 0) {
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
