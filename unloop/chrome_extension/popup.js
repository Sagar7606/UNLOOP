
document.addEventListener("DOMContentLoaded", () => {
  const websiteName = document.getElementById("websiteName");
  const websiteStatus = document.getElementById("websiteStatus");
  const detectButton = document.getElementById("detectButton");
  const subscriptionForm = document.getElementById("subscriptionForm");

  const serviceName = document.getElementById("serviceName");
  const price = document.getElementById("price");
  const billingDate = document.getElementById("billingDate");
  const message = document.getElementById("message");

  const accountSelect = document.getElementById("accountSelect");
  const billingCycle = document.getElementById("billingCycle");

  const UNLOOP_URLS = [
    "https://unloop-tau.vercel.app/*",
    "http://localhost:5174/*"
  ];

  let currentWebsite = null;
  let detectedDetails = null;

  // -----------------------------------------
  // 1. SHOW MESSAGE
  // -----------------------------------------

  function showMessage(text, color = "#168052") {
    message.textContent = text;
    message.style.color = color;
  }

  // -----------------------------------------
  // 2. GET CURRENT ACTIVE TAB
  // -----------------------------------------

  async function getCurrentTab() {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tabs.length || !tabs[0].id || !tabs[0].url) {
      throw new Error("Unable to access the current tab.");
    }

    return tabs[0];
  }

  // -----------------------------------------
  // 3. GET WEBSITE DETAILS
  // -----------------------------------------

  function getWebsiteDetails(tab) {
    const url = new URL(tab.url);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Please open a normal subscription website.");
    }

    return {
      name: tab.title || url.hostname,
      url: url.href,
      hostname: url.hostname.replace(/^www\./, "")
    };
  }

  // -----------------------------------------
  // 4. INJECT CONTENT SCRIPT INTO A TAB
  // -----------------------------------------

  async function prepareTab(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: {
          tabId: tabId
        },
        files: ["content.js"]
      });
    } catch (error) {
      console.error("Content script injection failed:", error);

      throw new Error(
        "Cannot connect to this page. Refresh the page and try again. Browser-protected pages are not supported."
      );
    }
  }

  // -----------------------------------------
  // 5. FIND OPEN UNLOOP DASHBOARD TAB
  // -----------------------------------------

  async function findUnloopTab() {
    const tabs = await chrome.tabs.query({
      url: UNLOOP_URLS
    });

    const availableTabs = tabs.filter(
      tab => tab.id && tab.url
    );

    if (!availableTabs.length) {
      throw new Error(
        "UNLOOP dashboard is not open. Open the UNLOOP dashboard in another tab first."
      );
    }

    // Prefer the live dashboard if multiple tabs exist.
    const liveTab = availableTabs.find(tab =>
      tab.url.startsWith("https://unloop-tau.vercel.app/")
    );

    return liveTab || availableTabs[0];
  }

  // -----------------------------------------
  // 6. IDENTIFY CURRENT WEBSITE
  // -----------------------------------------

  async function identifyWebsite() {
    try {
      const tab = await getCurrentTab();

      currentWebsite = getWebsiteDetails(tab);

      websiteName.textContent = currentWebsite.name;

      websiteStatus.textContent =
        "Website detected. Click Detect Website to scan subscription details.";

      detectButton.disabled = false;

    } catch (error) {
      currentWebsite = null;

      websiteName.textContent = "Website unavailable";
      websiteStatus.textContent = error.message;

      detectButton.disabled = true;
    }
  }

  // -----------------------------------------
  // 7. SCAN SUBSCRIPTION WEBSITE
  // -----------------------------------------

  async function scanWebsite() {
    try {
      const tab = await getCurrentTab();

      currentWebsite = getWebsiteDetails(tab);

      detectedDetails = null;

      showMessage(
        "Preparing website scanner...",
        "#2563eb"
      );

      // Inject content.js into subscription website.
      await prepareTab(tab.id);

      showMessage(
        "Scanning subscription details...",
        "#2563eb"
      );

      const response = await chrome.tabs.sendMessage(
        tab.id,
        {
          action: "DETECT_SUBSCRIPTION"
        }
      );

      if (!response || !response.success) {
        throw new Error(
          response?.message ||
          "Could not detect subscription details. You can enter them manually."
        );
      }

      detectedDetails = response.subscription || {};

      // Fill detected information.
      serviceName.value =
        detectedDetails.name || "";

      price.value =
        detectedDetails.price !== undefined &&
        detectedDetails.price !== null
          ? detectedDetails.price
          : "";

      billingDate.value =
        detectedDetails.nextBillingDate || "";

      if (
        billingCycle &&
        detectedDetails.billingCycle
      ) {
        billingCycle.value =
          detectedDetails.billingCycle;
      }

      websiteName.textContent =
        detectedDetails.websiteName ||
        currentWebsite.name;

      websiteStatus.textContent =
        "Website scanned. Review the detected details.";

      const missing = [];

      if (!detectedDetails.name) {
        missing.push("Plan name");
      }

      if (detectedDetails.price == null) {
        missing.push("Price");
      }

      if (!detectedDetails.nextBillingDate) {
        missing.push("Next billing date");
      }

      if (missing.length > 0) {
        showMessage(
          "Scan completed. Please enter: " +
          missing.join(", "),
          "#b45309"
        );
      } else {
        showMessage(
          "Subscription detected! Review the details before saving."
        );
      }

    } catch (error) {
      detectedDetails = null;

      console.error("Website scan error:", error);

      showMessage(
        error.message ||
        "Unable to scan this website.",
        "#dc2626"
      );
    }
  }

  detectButton.addEventListener(
    "click",
    scanWebsite
  );

  // -----------------------------------------
  // 8. SAVE SUBSCRIPTION TO SELECTED ACCOUNT
  // -----------------------------------------

  subscriptionForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const name = serviceName.value.trim();
      const amount = Number(price.value);
      const nextBillingDate = billingDate.value;

      // Validate account.
      if (
        !accountSelect ||
        !accountSelect.value
      ) {
        showMessage(
          "Please select an account.",
          "#dc2626"
        );
        return;
      }

      // Validate subscription details.
      if (
        !name ||
        !nextBillingDate ||
        price.value === "" ||
        amount < 0 ||
        !Number.isFinite(amount)
      ) {
        showMessage(
          "Please enter valid subscription details.",
          "#dc2626"
        );
        return;
      }

      try {
        const tab = await getCurrentTab();

        const website = getWebsiteDetails(tab);

        const selectedAccount =
          accountSelect.value;

        // Prepare subscription data.
        const subscription = {
          id: crypto.randomUUID(),

          name: name,

          price: amount,

          currency:
            detectedDetails?.currency || "INR",

          billingCycle:
            billingCycle?.value ||
            detectedDetails?.billingCycle ||
            "Monthly",

          nextBillingDate: nextBillingDate,

          websiteName:
            detectedDetails?.websiteName ||
            website.name,

          websiteUrl: website.url,

          planName:
            detectedDetails?.planName ||
            name,

          source: "Chrome Extension",

          createdAt: new Date().toISOString(),

          // Account selected by the user.
          targetAccountId: selectedAccount
        };

        // Find the actual UNLOOP dashboard.
        showMessage(
          "Finding UNLOOP dashboard...",
          "#2563eb"
        );

        const unloopTab = await findUnloopTab();

        // IMPORTANT:
        // Inject content.js into the UNLOOP dashboard.
        showMessage(
          "Connecting to UNLOOP...",
          "#2563eb"
        );

        await prepareTab(unloopTab.id);

        // Send bookmark to UNLOOP dashboard.
        showMessage(
          "Sending bookmark to UNLOOP...",
          "#2563eb"
        );

        const websiteResponse =
          await chrome.tabs.sendMessage(
            unloopTab.id,
            {
              action: "SAVE_BOOKMARK",
              subscription: subscription
            }
          );

        if (!websiteResponse?.success) {
          throw new Error(
            websiteResponse?.message ||
            "UNLOOP could not save this bookmark."
          );
        }

        // Save extension history.
        showMessage(
          "Updating extension history...",
          "#2563eb"
        );

        const storageResponse =
          await chrome.runtime.sendMessage({
            action: "SAVE_SUBSCRIPTION",

            subscription: {
              ...subscription,
              accountId: selectedAccount
            }
          });

        if (!storageResponse?.success) {
          showMessage(
            "Bookmark saved to UNLOOP, but extension history could not be updated.",
            "#b45309"
          );
          return;
        }

        // Success.
        showMessage(
          `Successfully saved "${name}" to ${selectedAccount}!`
        );

        subscriptionForm.reset();

        detectedDetails = null;

      } catch (error) {
        console.error("Bookmark save error:", error);

        showMessage(
          error.message ||
          "Unable to save bookmark.",
          "#dc2626"
        );
      }
    }
  );

  // -----------------------------------------
  // 9. INITIALIZE POPUP
  // -----------------------------------------

  identifyWebsite();
});
