# Interactive Features Google Sheets Setup

This guide covers setting up Google Sheets integration for the three interactive features:
1. Song Requests
2. Advice for Newlyweds
3. Predictions Poll

## Option 1: Three Separate Sheets (Recommended)

Create three different Google Sheets, each with its own Apps Script deployment.

### Sheet 1: Song Requests

**Spreadsheet Name:** "Song Requests - Bogdan & Corina Wedding"

**Column Headers:**
| guestName | songTitle | artist | specialReason | timestamp |
|-----------|-----------|--------|---------------|-----------|

**Apps Script Code:**
```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    const guestName = e.parameter.guestName || '';
    const songTitle = e.parameter.songTitle || '';
    const artist = e.parameter.artist || '';
    const specialReason = e.parameter.specialReason || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();

    sheet.appendRow([guestName, songTitle, artist, specialReason, timestamp]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

**Deploy Instructions:**
1. Create the sheet with headers above
2. Go to Extensions → Apps Script
3. Paste the code above
4. Deploy as Web App (Execute as: Me, Access: Anyone)
5. Copy the deployment URL
6. Update `src/components/wedding/SongRequestsSection.tsx` line 7:
   ```typescript
   const SONG_REQUESTS_URL = 'YOUR_DEPLOYMENT_URL_HERE';
   ```

---

### Sheet 2: Advice for Newlyweds

**Spreadsheet Name:** "Wedding Advice - Bogdan & Corina"

**Column Headers:**
| guestName | adviceType | advice | timestamp |
|-----------|------------|--------|-----------|

**Apps Script Code:**
```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    const guestName = e.parameter.guestName || '';
    const adviceType = e.parameter.adviceType || '';
    const advice = e.parameter.advice || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();

    sheet.appendRow([guestName, adviceType, advice, timestamp]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

**Deploy Instructions:**
1. Create the sheet with headers above
2. Go to Extensions → Apps Script
3. Paste the code above
4. Deploy as Web App (Execute as: Me, Access: Anyone)
5. Copy the deployment URL
6. Update `src/components/wedding/AdviceSection.tsx` line 7:
   ```typescript
   const ADVICE_URL = 'YOUR_DEPLOYMENT_URL_HERE';
   ```

---

### Sheet 3: Predictions Poll

**Spreadsheet Name:** "Wedding Predictions - Bogdan & Corina"

**Column Headers:**
| guestName | criesFirst | betterDancer | wakesEarlier | betterCook | moreRomantic | saysILoveYouFirst | timestamp |
|-----------|------------|--------------|--------------|------------|--------------|-------------------|-----------|

**Apps Script Code:**
```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    const guestName = e.parameter.guestName || '';
    const criesFirst = e.parameter.criesFirst || '';
    const betterDancer = e.parameter.betterDancer || '';
    const wakesEarlier = e.parameter.wakesEarlier || '';
    const betterCook = e.parameter.betterCook || '';
    const moreRomantic = e.parameter.moreRomantic || '';
    const saysILoveYouFirst = e.parameter.saysILoveYouFirst || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();

    sheet.appendRow([
      guestName,
      criesFirst,
      betterDancer,
      wakesEarlier,
      betterCook,
      moreRomantic,
      saysILoveYouFirst,
      timestamp
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

**Deploy Instructions:**
1. Create the sheet with headers above
2. Go to Extensions → Apps Script
3. Paste the code above
4. Deploy as Web App (Execute as: Me, Access: Anyone)
5. Copy the deployment URL
6. Update `src/components/wedding/PredictionsSection.tsx` line 7:
   ```typescript
   const PREDICTIONS_URL = 'YOUR_DEPLOYMENT_URL_HERE';
   ```

---

## Option 2: Single Sheet with Multiple Tabs

If you prefer one spreadsheet with three tabs:

1. Create a new Google Spreadsheet
2. Rename the tabs: "Song Requests", "Advice", "Predictions"
3. Add the appropriate column headers to each tab
4. Use this single Apps Script that routes to different tabs:

```javascript
function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const type = e.parameter.type; // Pass 'type' parameter from frontend

    let sheet;
    let rowData;

    if (type === 'song') {
      sheet = spreadsheet.getSheetByName('Song Requests');
      rowData = [
        e.parameter.guestName || '',
        e.parameter.songTitle || '',
        e.parameter.artist || '',
        e.parameter.specialReason || '',
        e.parameter.timestamp || new Date().toISOString()
      ];
    } else if (type === 'advice') {
      sheet = spreadsheet.getSheetByName('Advice');
      rowData = [
        e.parameter.guestName || '',
        e.parameter.adviceType || '',
        e.parameter.advice || '',
        e.parameter.timestamp || new Date().toISOString()
      ];
    } else if (type === 'predictions') {
      sheet = spreadsheet.getSheetByName('Predictions');
      rowData = [
        e.parameter.guestName || '',
        e.parameter.criesFirst || '',
        e.parameter.betterDancer || '',
        e.parameter.wakesEarlier || '',
        e.parameter.betterCook || '',
        e.parameter.moreRomantic || '',
        e.parameter.saysILoveYouFirst || '',
        e.parameter.timestamp || new Date().toISOString()
      ];
    }

    if (sheet && rowData) {
      sheet.appendRow(rowData);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error('Invalid type or sheet not found');
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

If using this option, you'll need to modify each component to add a `type` parameter:
- SongRequestsSection: `params.append('type', 'song');`
- AdviceSection: `params.append('type', 'advice');`
- PredictionsSection: `params.append('type', 'predictions');`

---

## Analyzing the Results

### Song Requests
- Sort by popularity to create your reception playlist
- Filter by "specialReason" to find songs with personal meaning
- Create a Spotify/Apple Music playlist based on requests

### Advice
- Filter by "adviceType" to group similar advice
- Create a wedding scrapbook with the best advice
- Read them together on your first anniversary!

### Predictions Poll
Use Google Sheets formulas to tally results:
```
=COUNTIF(B2:B100,"Bogdan")
=COUNTIF(B2:B100,"Corina")
```

Create a fun reveal at your reception showing what guests predicted!

---

## Email Notifications (Optional)

Add email notifications to any of the scripts by adding this after `sheet.appendRow()`:

```javascript
MailApp.sendEmail({
  to: "your-email@example.com",
  subject: `New ${type} Submission`,
  body: `Check your spreadsheet for the latest entry!`
});
```

---

## Testing

1. Run `npm start`
2. Navigate to `/interactive` (or click "Fun & Interactive" button)
3. Test each form
4. Check your Google Sheets for the data

---

## Troubleshooting

**Data not appearing:**
- Verify column headers match exactly (case-sensitive)
- Check Apps Script is deployed with "Anyone" access
- Ensure correct deployment URL in component files

**Authorization issues:**
- Re-authorize the script
- Use the same Google account for all sheets
- Check script permissions in Google Apps Script dashboard

**Need to update a script:**
- Make changes in Apps Script editor
- Deploy → Manage deployments → Edit → New version
- URL stays the same!

---

## Files to Update

After setting up your Google Sheets, update these files:

1. `src/components/wedding/SongRequestsSection.tsx` (line 7)
2. `src/components/wedding/AdviceSection.tsx` (line 7)
3. `src/components/wedding/PredictionsSection.tsx` (line 7)

Replace `'YOUR_..._SCRIPT_URL'` with your actual deployment URLs.

---

## Access the Page

Guests can access the interactive features by:
- Clicking "Fun & Interactive →" button in the RSVP section
- Clicking the link in the footer
- Navigating directly to `/interactive`

Happy wedding planning! 🎉💕
