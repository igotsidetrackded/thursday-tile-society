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

        // Create container for date and host
        const infoDiv = document.createElement("div");
        infoDiv.className = "game-info";

        const dateSpan = document.createElement("span");
        dateSpan.className = "game-date";
        dateSpan.innerHTML = `<strong>${game.date}</strong>`;
        infoDiv.appendChild(dateSpan);

        // Add host name if present
        if (game.host) {
          const hostSpan = document.createElement("span");
          hostSpan.className = "game-host";
          hostSpan.textContent = `Host: ${game.host}`;
          infoDiv.appendChild(hostSpan);
        }

        // Determine badge styling based on status string
        // Safely handle missing/null values and case variations
        const statusText = (game.status || "").toUpperCase();

        let badgeClass = "badge-pending";
        if (statusText.includes("CONFIRMED")) {
          badgeClass = "badge-confirmed";
        } else if (statusText.includes("NEEDS HOST")) {
          badgeClass = "badge-host";
        }

        const badgeSpan = document.createElement("span");
        badgeSpan.className = `status-badge ${badgeClass}`;
        badgeSpan.textContent = game.status;

        item.appendChild(infoDiv);
        item.appendChild(badgeSpan);
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
