const { google } = require("googleapis");
const fs = require("fs");

// Month tabs to sync from your Google Sheet
const TAB_NAMES = [
  "September '26",
  "October '26",
  "November '26",
  "December '26",
];

async function syncSchedule() {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Missing required env var: SPREADSHEET_ID");
    }

    const rawKey = process.env.GCP_SERVICE_ACCOUNT_KEY;
    if (!rawKey) {
      throw new Error("Missing required env var: GCP_SERVICE_ACCOUNT_KEY");
    }

    let credentials;
    try {
      credentials = JSON.parse(rawKey);
    } catch {
      throw new Error("GCP_SERVICE_ACCOUNT_KEY must be valid JSON");
    }

    // Authenticate using the Service Account JSON key stored in GitHub Secrets
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Build the sheet ranges using the single-quote escape rule (e.g., "'September ''26'!A1:Z100")
    const ranges = TAB_NAMES.map(
      (tab) => `'${tab.replace(/'/g, "''")}'!A1:Z100`,
    );

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
      valueRenderOption: "FORMATTED_VALUE", // Reads calculated values/strings, not raw formulas
    });

    const valueRanges = response.data.valueRanges || [];
    const scheduleOutput = {
      lastUpdated: new Date().toISOString(),
      tabs: [],
    };

    valueRanges.forEach((rangeObj, index) => {
      const originalTabName = TAB_NAMES[index];
      const rows = rangeObj.values || [];
      const games = [];

      let currentDate = "";

      // Loop through all rows in the sheet tab
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const colA = (row[0] || "").trim();
        const colB = (row[1] || "").trim();

        // 1. Detect Date Row: Merged row or header above the "Slot #" block
        // Ignores standard headers and player slot labels
        if (
          colA &&
          colA !== "Slot #" &&
          !colA.startsWith("Player") &&
          colA !== "Game Status"
        ) {
          currentDate = colA;
        }

        // 2. Detect "Game Status" Row: Finds 'Game Status' in Column A and reads the calculated value in Column B
        if (colA === "Game Status") {
          const statusValue = colB || "Pending";
          games.push({
            date: currentDate || `${originalTabName} Game`,
            status: statusValue,
          });
        }
      }

      if (games.length > 0) {
        scheduleOutput.tabs.push({
          tabName: originalTabName,
          games: games,
        });
      }
    });

    // Save output to schedule.json in the repository root
    fs.writeFileSync("schedule.json", JSON.stringify(scheduleOutput, null, 2));
    console.log("Successfully generated schedule.json from Google Sheets!");
  } catch (error) {
    console.error("Error syncing schedule from Google Sheets:", error);
    process.exit(1);
  }
}

syncSchedule();
