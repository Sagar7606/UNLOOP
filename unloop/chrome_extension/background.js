
chrome.runtime.onInstalled.addListener(() => {
  console.log("UNLOOP Extension installed successfully!");

  chrome.storage.local.get(["unloopSubscriptions"], (result) => {
    if (!Array.isArray(result.unloopSubscriptions)) {
      chrome.storage.local.set({
        unloopSubscriptions: []
      });
    }
  });
});

// Handle messages from popup or other extension pages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_SUBSCRIPTIONS") {
    chrome.storage.local.get(["unloopSubscriptions"], (result) => {
      sendResponse({
        success: true,
        subscriptions: result.unloopSubscriptions || []
      });
    });

    return true;
  }

  if (request.action === "SAVE_SUBSCRIPTION") {
    chrome.storage.local.get(["unloopSubscriptions"], (result) => {
      const subscriptions = result.unloopSubscriptions || [];

      subscriptions.push(request.subscription);

      chrome.storage.local.set(
        { unloopSubscriptions: subscriptions },
        () => {
          sendResponse({
            success: true,
            message: "Subscription saved successfully."
          });
        }
      );
    });

    return true;
  }

  if (request.action === "DELETE_SUBSCRIPTION") {
    chrome.storage.local.get(["unloopSubscriptions"], (result) => {
      const subscriptions = result.unloopSubscriptions || [];

      const updatedSubscriptions = subscriptions.filter(
        item => item.id !== request.id
      );

      chrome.storage.local.set(
        { unloopSubscriptions: updatedSubscriptions },
        () => {
          sendResponse({
            success: true,
            message: "Subscription deleted successfully."
          });
        }
      );
    });

    return true;
  }
});
