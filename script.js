document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("schedule-display");
  if (!container) return;

  try {
    const response = await fetch("./schedule.json");
    if (!response.ok) throw new Error("Schedule data unavailable");

    const data = await response.json();
    container.innerHTML = ""; // Clear loading text

    if (!data.tabs || data.tabs.length === 0) {
      container.innerHTML = "<p>No upcoming schedule dates found.</p>";
      return;
    }

    // Loop through each tab (month) fetched from Google Sheets
    data.tabs.forEach((tab) => {
      const monthSection = document.createElement("div");
      monthSection.className = "month-block";

      const monthTitle = document.createElement("h3");
      monthTitle.textContent = tab.tabName;
      monthSection.appendChild(monthTitle);

      const statusList = document.createElement("ul");
      statusList.className = "status-list";

      // Loop through each Thursday entry in this month
      tab.games.forEach((game) => {
        const item = document.createElement("li");
        item.className = "game-item";

        // Determine badge styling based on status string
        const statusUpper = String(game.status || "").toUpperCase();

        let badgeClass = "badge-pending";
        if (statusUpper.includes("CONFIRMED")) {
          badgeClass = "badge-confirmed";
        } else if (statusUpper.includes("NEEDS HOST")) {
          badgeClass = "badge-host";
        }

        const dateSpan = document.createElement("span");
        dateSpan.className = "game-date";

        const dateStrong = document.createElement("strong");
        dateStrong.textContent = String(game.date || "");
        dateSpan.appendChild(dateStrong);

        const statusSpan = document.createElement("span");
        statusSpan.className = `status-badge ${badgeClass}`;
        statusSpan.textContent = String(game.status || "");

        item.replaceChildren(dateSpan, statusSpan);
        statusList.appendChild(item);
      });

      monthSection.appendChild(statusList);
      container.appendChild(monthSection);
    });
  } catch (err) {
    console.error("Error loading schedule:", err);
    container.innerHTML =
      "<p>Unable to load live schedule status right now. Please check back soon!</p>";
  }
});
