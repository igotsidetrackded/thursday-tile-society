(() => {
  const analyticsId = "G-DZ3PLKV9YG";
  const analyticsPreferenceKey = "analytics-consent";
  const toggleButton = document.getElementById("analytics-toggle");
  const statusEl = document.getElementById("analytics-consent-status");
  let analyticsLoaded = false;

  function loadAnalytics() {
    window[`ga-disable-${analyticsId}`] = false;
    if (analyticsLoaded) {
      if (typeof window.gtag === "function") {
        window.gtag("config", analyticsId);
      }
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", analyticsId);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.appendChild(script);
    analyticsLoaded = true;
  }

  function updateUI(optedOut, showStatus) {
    if (toggleButton) {
      toggleButton.textContent = optedOut ? "Opt back in" : "Opt out";
      toggleButton.setAttribute("aria-pressed", optedOut ? "true" : "false");
    }
    if (statusEl) {
      if (optedOut) {
        statusEl.textContent = "(Analytics off)";
      } else if (showStatus) {
        statusEl.textContent = "(Analytics on)";
      } else {
        statusEl.textContent = "";
      }
    }
  }

  let savedPreference = null;
  try {
    savedPreference = localStorage.getItem(analyticsPreferenceKey);
  } catch {
    savedPreference = null;
  }

  let isOptedOut = savedPreference === "denied";

  if (isOptedOut) {
    window[`ga-disable-${analyticsId}`] = true;
  } else {
    loadAnalytics();
  }
  updateUI(isOptedOut, false);

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      isOptedOut = !isOptedOut;
      try {
        localStorage.setItem(
          analyticsPreferenceKey,
          isOptedOut ? "denied" : "granted",
        );
      } catch {
        // Keep preference for the current page view if storage is unavailable.
      }

      if (isOptedOut) {
        window[`ga-disable-${analyticsId}`] = true;
      } else {
        loadAnalytics();
      }
      updateUI(isOptedOut, true);
    });
  }
})();
