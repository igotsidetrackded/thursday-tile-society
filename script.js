document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("schedule-display");
  if (!container) return;

  try {
    const response = await fetch("./schedule.json");
    if (!response.ok) throw new Error("Schedule data unavailable");

    const data = await response.json();
    container.textContent = ""; // Clear loading text safely

    if (!data.tabs || data.tabs.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No upcoming schedule dates found.";
      container.appendChild(emptyMsg);
      return;
    }

    // Helper to strip leading/trailing dashes, en-dashes, em-dashes, and spaces
    const cleanTabName = (name) =>
      (name || "").replace(/^[\s\-–—]+|[\s\-–—]+$/g, "").trim();

    // Identify current month and year string (e.g., "September '26")
    const now = new Date();
    const currentMonthName = now.toLocaleString("en-US", { month: "long" });
    const currentYearShort = now.getFullYear().toString().slice(-2);
    const currentMonthTabStr = `${currentMonthName} '${currentYearShort}`;

    // Tracks whether we have already rendered the current month
    let foundCurrentMonth = false;

    data.tabs.forEach((tab) => {
      const displayName = cleanTabName(tab.tabName);
      const isCurrentMonth =
        displayName.toLowerCase() === currentMonthTabStr.toLowerCase();

      if (isCurrentMonth) {
        foundCurrentMonth = true;
      }

      // 1. Create Month Section Container
      const monthSection = document.createElement("div");
      monthSection.className = "month-block";

      // 2. Decide whether to wrap in <details> accordion
      const isAccordion = foundCurrentMonth && !isCurrentMonth;
      let listParent = monthSection;

      if (isAccordion) {
        const details = document.createElement("details");
        details.className = "month-accordion";

        const summary = document.createElement("summary");
        summary.className = "accordion-header";

        const monthTitle = document.createElement("h3");
        monthTitle.className = "accordion-title";
        monthTitle.textContent = displayName;
        summary.appendChild(monthTitle);

        details.appendChild(summary);
        monthSection.appendChild(details);
        listParent = details;
      } else {
        const monthTitle = document.createElement("h3");
        monthTitle.textContent = displayName;
        monthSection.appendChild(monthTitle);
      }

      // 3. Build Games List
      const statusList = document.createElement("ul");
      statusList.className = "status-list";

      (tab.games || []).forEach((game) => {
        const item = document.createElement("li");
        item.className = "game-item";

        const infoDiv = document.createElement("div");
        infoDiv.className = "game-info";

        // XSS-Safe Date Element Construction
        const dateSpan = document.createElement("span");
        dateSpan.className = "game-date";
        const dateStrong = document.createElement("strong");
        dateStrong.textContent = game.date || "";
        dateSpan.appendChild(dateStrong);
        infoDiv.appendChild(dateSpan);

        // Host Display
        if (game.host) {
          const hostSpan = document.createElement("span");
          hostSpan.className = "game-host";
          hostSpan.textContent = `Host: ${game.host}`;
          infoDiv.appendChild(hostSpan);
        }

        // Status Normalization
        const statusText = (game.status || "").toUpperCase();

        let badgeClass = "badge-pending";
        if (statusText.includes("CONFIRMED")) {
          badgeClass = "badge-confirmed";
        } else if (statusText.includes("NEEDS HOST")) {
          badgeClass = "badge-host";
        }

        const badgeSpan = document.createElement("span");
        badgeSpan.className = `status-badge ${badgeClass}`;
        badgeSpan.textContent = game.status || "Pending";

        item.appendChild(infoDiv);
        item.appendChild(badgeSpan);
        statusList.appendChild(item);
      });

      listParent.appendChild(statusList);
      container.appendChild(monthSection);
    });
  } catch (err) {
    console.error("Error loading schedule:", err);
    container.textContent = "";
    const errorMsg = document.createElement("p");
    errorMsg.textContent =
      "Unable to load live schedule status right now. Please check back soon!";
    container.appendChild(errorMsg);
  }
});
