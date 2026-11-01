
/* -----------------------------------------
   UNLOOP CONTENT SCRIPT
   1. Detect subscription details
   2. Send bookmark to UNLOOP dashboard
------------------------------------------ */

// Prevent duplicate listeners if the script is injected again.
if (!globalThis.__UNLOOP_CONTENT_INITIALIZED__) {
  globalThis.__UNLOOP_CONTENT_INITIALIZED__ = true;

  const pendingRequests = new Map();

  // -----------------------------------------
  // 1. RECEIVE RESPONSE FROM UNLOOP WEBSITE
  // -----------------------------------------

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    const data = event.data;

    if (
      !data ||
      data.source !== "UNLOOP_WEB" ||
      data.type !== "UNLOOP_RESPONSE"
    ) {
      return;
    }

    const pending = pendingRequests.get(data.requestId);

    if (!pending) return;

    clearTimeout(pending.timeout);
    pendingRequests.delete(data.requestId);

    pending.resolve(data.response);
  });

  // -----------------------------------------
  // 2. SEND BOOKMARK TO UNLOOP WEBSITE
  // -----------------------------------------

  function sendToUnloopWebsite(action, payload = {}) {
    return new Promise((resolve) => {
      const requestId = crypto.randomUUID();

      const timeout = setTimeout(() => {
        pendingRequests.delete(requestId);

        resolve({
          success: false,
          message:
            "UNLOOP dashboard did not respond. Refresh the dashboard and try again."
        });
      }, 10000);

      pendingRequests.set(requestId, {
        resolve,
        timeout
      });

      window.postMessage(
        {
          source: "UNLOOP_EXTENSION",
          type: action,
          requestId,
          payload
        },
        window.location.origin
      );
    });
  }

  // -----------------------------------------
  // 3. TEXT HELPERS
  // -----------------------------------------

  function getPageText() {
    return document.body?.innerText || "";
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // -----------------------------------------
  // 4. FIND PRICE
  // -----------------------------------------

  function extractPrice(text) {
    const patterns = [
      /(?:₹|INR|Rs\.?)\s?([\d,]+(?:\.\d{1,2})?)/i,
      /([\d,]+(?:\.\d{1,2})?)\s?(?:₹|INR)/i,
      /(?:USD|\$)\s?([\d,]+(?:\.\d{1,2})?)/i,
      /([\d,]+(?:\.\d{1,2})?)\s?(?:USD)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);

      if (!match) continue;

      const amount = Number(match[1].replace(/,/g, ""));

      if (!Number.isFinite(amount)) continue;

      const currencyText = match[0];

      return {
        price: amount,
        currency: /₹|INR|Rs/i.test(currencyText)
          ? "INR"
          : "USD"
      };
    }

    return null;
  }

  // -----------------------------------------
  // 5. FIND BILLING CYCLE
  // -----------------------------------------

  function extractBillingCycle(text) {
    const lower = text.toLowerCase();

    if (
      /\b(annual|annually|yearly|per year|\/year)\b/.test(lower)
    ) {
      return "Yearly";
    }

    if (
      /\b(quarterly|every 3 months)\b/.test(lower)
    ) {
      return "Quarterly";
    }

    if (
      /\b(weekly|per week|\/week)\b/.test(lower)
    ) {
      return "Weekly";
    }

    if (
      /\b(monthly|per month|\/month)\b/.test(lower)
    ) {
      return "Monthly";
    }

    if (
      /\b(one[- ]time|lifetime|single payment)\b/.test(lower)
    ) {
      return "One-time";
    }

    return null;
  }

  // -----------------------------------------
  // 6. FIND NEXT BILLING DATE
  // -----------------------------------------

  function extractNextBillingDate(text) {
    const patterns = [
      /(?:next billing date|next payment date|next renewal date|renews on|renewal date|next charge)\s*[:\-]?\s*(\d{4}-\d{2}-\d{2})/i,

      /(?:next billing date|next payment date|next renewal date|renews on|renewal date|next charge)\s*[:\-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i,

      /(?:next billing date|next payment date|next renewal date|renews on|renewal date|next charge)\s*[:\-]?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);

      if (!match) continue;

      const value = match[1];

      // ISO date: preserve the exact calendar date.
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
      }

      // Slash dates are ambiguous across countries.
      // Do not guess whether they mean DD/MM or MM/DD.
      if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(value)) {
        continue;
      }

      const parsed = new Date(value);

      if (!Number.isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      }
    }

    return null;
  }

  // -----------------------------------------
  // 7. FIND PLAN NAME
  // -----------------------------------------

  function extractPlanName() {
    const selectors = [
      "[data-unloop-plan]",
      "[data-plan-name]",
      '[data-testid*="plan"]',
      ".plan-name",
      ".subscription-name",
      ".plan-title"
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);

      if (!element) continue;

      const value = cleanText(
        element.getAttribute("data-unloop-plan") ||
        element.getAttribute("data-plan-name") ||
        element.innerText
      );

      if (value) return value;
    }

    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3")
    );

    const planHeading = headings.find((element) =>
      /\b(plan|premium|pro|basic|standard|plus)\b/i.test(
        element.innerText
      )
    );

    return planHeading
      ? cleanText(planHeading.innerText)
      : null;
  }

  // -----------------------------------------
  // 8. SCAN CURRENT WEBSITE
  // -----------------------------------------

  function detectSubscription() {
    const pageText = getPageText();

    if (!pageText.trim()) {
      return {
        success: false,
        message: "No readable page content found."
      };
    }

    const url = new URL(window.location.href);

    const priceDetails = extractPrice(pageText);
    const planName = extractPlanName();
    const billingCycle = extractBillingCycle(pageText);

    const nextBillingDate =
      extractNextBillingDate(pageText);

    const subscription = {
      websiteName: document.title || url.hostname,
      websiteUrl: url.href,

      name: planName || document.title || url.hostname,
      planName,

      price: priceDetails?.price ?? null,
      currency: priceDetails?.currency ?? null,

      billingCycle,
      nextBillingDate
    };

    const hasSubscriptionDetails =
      priceDetails ||
      planName ||
      billingCycle ||
      nextBillingDate;

    if (!hasSubscriptionDetails) {
      return {
        success: false,
        message:
          "No subscription details found. Open the billing or confirmation page and try again."
      };
    }

    return {
      success: true,
      subscription
    };
  }

  // -----------------------------------------
  // 9. HANDLE EXTENSION MESSAGES
  // -----------------------------------------

  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (!request || !request.action) return;

      // Scan current subscription website.
      if (request.action === "DETECT_SUBSCRIPTION") {
        try {
          sendResponse(detectSubscription());
        } catch (error) {
          console.error("UNLOOP scan error:", error);

          sendResponse({
            success: false,
            message: "Unable to scan website details."
          });
        }

        return false;
      }

      // Forward bookmark to the UNLOOP React application.
      if (request.action === "SAVE_BOOKMARK") {
        sendToUnloopWebsite(
          "SAVE_BOOKMARK",
          {
            subscription: request.subscription
          }
        )
          .then(sendResponse)
          .catch((error) => {
            sendResponse({
              success: false,
              message: error.message || "Bookmark forwarding failed."
            });
          });

        return true;
      }
    }
  );

  console.log("UNLOOP content script initialized:", window.location.href);
}
