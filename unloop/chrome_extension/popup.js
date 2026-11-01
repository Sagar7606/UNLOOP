
document.addEventListener("DOMContentLoaded", () => {
  const websiteName = document.getElementById("websiteName");
  const websiteStatus = document.getElementById("websiteStatus");
  const detectButton = document.getElementById("detectButton");
  const subscriptionForm = document.getElementById("subscriptionForm");
  const serviceName = document.getElementById("serviceName");
  const price = document.getElementById("price");
  const billingDate = document.getElementById("billingDate");
  const message = document.getElementById("message");

  let detectedService = "";

  const supportedServices = {
    "netflix.com": "Netflix",
    "spotify.com": "Spotify",
    "youtube.com": "YouTube Premium",
    "primevideo.com": "Amazon Prime Video",
    "amazon.in": "Amazon Prime",
    "disneyplus.com": "Disney+",
    "hotstar.com": "JioHotstar",
    "adobe.com": "Adobe",
    "canva.com": "Canva",
    "apple.com": "Apple Services",
    "microsoft.com": "Microsoft",
    "crunchyroll.com": "Crunchyroll"
  };

  // Identify current website
  async function identifyWebsite() {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      const currentTab = tabs[0];

      if (!currentTab || !currentTab.url) {
        throw new Error("Unable to access current website.");
      }

      const url = new URL(currentTab.url);
      const hostname = url.hostname.replace(/^www\./, "");

      if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
      ) {
        websiteName.textContent = "Unsupported page";
        websiteStatus.textContent =
          "Open a subscription website to continue.";
        detectButton.disabled = true;
        return;
      }

      const matchedDomain = Object.keys(supportedServices).find(
        domain =>
          hostname === domain ||
          hostname.endsWith("." + domain)
      );

      detectedService = matchedDomain
        ? supportedServices[matchedDomain]
        : "";

      websiteName.textContent = detectedService || hostname;

      websiteStatus.textContent = detectedService
        ? "Supported subscription platform recognised."
        : "Website recognised. Subscription platform not in demo list.";

      detectButton.disabled = false;

    } catch (error) {
      websiteName.textContent = "Website unavailable";
      websiteStatus.textContent = error.message;
      detectButton.disabled = true;
    }
  }

  // Detect button
  detectButton.addEventListener("click", () => {
    if (!detectedService) {
      message.style.color = "#b45309";
      message.textContent =
        "This website is not in the supported demo list.";
      return;
    }

    serviceName.value = detectedService;

    message.style.color = "#168052";
    message.textContent =
      detectedService + " recognised. Please confirm the details.";
  });

  // Save subscription
  subscriptionForm.addEventListener("submit", async event => {
    event.preventDefault();

    const name = serviceName.value.trim();
    const amount = Number(price.value);
    const nextBillingDate = billingDate.value;

    if (!name || !nextBillingDate || amount < 0 || !Number.isFinite(amount)) {
      message.style.color = "#dc2626";
      message.textContent = "Please enter valid subscription details.";
      return;
    }

    const subscription = {
      id: crypto.randomUUID(),
      name: name,
      price: amount,
      billingCycle: "Monthly",
      nextBillingDate: nextBillingDate,
      source: "Chrome Extension",
      demo: true,
      createdAt: new Date().toISOString()
    };

    try {
      const result = await chrome.storage.local.get([
        "unloopSubscriptions"
      ]);

      const subscriptions = result.unloopSubscriptions || [];

      subscriptions.push(subscription);

      await chrome.storage.local.set({
        unloopSubscriptions: subscriptions
      });

      message.style.color = "#168052";
      message.textContent =
        name + " saved successfully in the extension!";

      subscriptionForm.reset();

    } catch (error) {
      message.style.color = "#dc2626";
      message.textContent =
        "Unable to save subscription. Please try again.";
    }
  });

  identifyWebsite();
});
