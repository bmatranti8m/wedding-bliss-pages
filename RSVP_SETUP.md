# Google Sheets RSVP Setup Guide

## Overview
Your RSVP form is now configured to submit data to Google Sheets. Follow these steps to complete the setup.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Bogdan & Corina Wedding RSVPs"
4. In the first row, add these column headers (in this exact order):

| name | email | phone | attending | essay | timestamp |
|------|-------|-------|-----------|-------|-----------|

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Extract form data
    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const phone = e.parameter.phone || '';
    const attending = e.parameter.attending || '';
    const essay = e.parameter.essay || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();

    // Append row to sheet
    sheet.appendRow([name, email, phone, attending, essay, timestamp]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (disk icon)

## Step 3: Deploy the Script

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure settings:
   - **Description**: "Wedding RSVP Form Handler"
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. **Important**: You may need to authorize the script:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" if you see a warning
   - Click "Go to [your project name] (unsafe)"
   - Click "Allow"
7. Copy the **Web app URL** (it looks like: `https://script.google.com/macros/s/AKfycby.../exec`)

## Step 4: Update Your Website Code

1. Open `src/components/wedding/RSVPSection.tsx`
2. Find this line near the top:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with your copied Web app URL:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. Save the file

## Step 5: Test Your Form

1. Run `npm start` to start your development server
2. Navigate to the RSVP section
3. Fill out and submit the form
4. Check your Google Sheet - a new row should appear with the submitted data

## Troubleshooting

### Form submits but data doesn't appear in sheet
- Make sure your column headers match exactly: `name`, `email`, `phone`, `attending`, `essay`, `timestamp`
- Check that the script is deployed as "Anyone" can access
- Verify you copied the correct deployment URL

### Script authorization issues
- You must authorize the script to access your Google Sheet
- Use the Google account that owns the spreadsheet
- If you see security warnings, you can proceed safely since this is your own script

### Need to update the script?
If you make changes to the Apps Script:
1. Save your changes
2. Click **Deploy → Manage deployments**
3. Click the pencil icon to edit
4. Change the version to "New version"
5. Click **Deploy**
6. The URL stays the same, so no code changes needed!

## Data Format

Each RSVP submission will create a new row with:
- **name**: Guest's full name
- **email**: Guest's email address
- **phone**: Guest's phone number
- **attending**: Either "yes" or "no"
- **essay**: Optional message from the guest
- **timestamp**: ISO 8601 timestamp of submission

## Privacy & Security

- The form uses `mode: 'no-cors'` which is required for Google Apps Script
- Data is sent directly to your Google Sheet
- Only you have access to the Google Sheet
- Consider sharing the sheet with your partner by clicking "Share" in Google Sheets

## Optional Enhancements

### Email Notifications
Add this to your Apps Script to get email notifications for each RSVP:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const phone = e.parameter.phone || '';
    const attending = e.parameter.attending || '';
    const essay = e.parameter.essay || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();

    sheet.appendRow([name, email, phone, attending, essay, timestamp]);

    // Send email notification
    MailApp.sendEmail({
      to: "your-email@example.com", // Replace with your email
      subject: `New RSVP from ${name}`,
      body: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Attending: ${attending}
Message: ${essay}
Time: ${timestamp}
      `
    });

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Data Validation
Add data validation to your Google Sheet columns to keep data clean:
- **attending**: Data validation → List of items → "yes,no"
- **email**: Data validation → Text contains "@"

## Questions?
If you run into issues, check that:
1. Column headers are exactly: `name`, `email`, `phone`, `attending`, `essay`, `timestamp`
2. Apps Script is deployed with "Anyone" access
3. The deployment URL is correctly pasted in `RSVPSection.tsx`
