chrome.runtime.onInstalled.addListener(() => {
  console.log("UNLOOP Extension installed successfully!");

  chrome.storage.local.get(["unloopSubscriptions"], result => {
    if (!Array.isArray(result.unloopSubscriptions)) {
      chrome.storage.local.set({
        unloopSubscriptions: []
      });
    }
  });
});

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {

    if (request.action === "GET_SUBSCRIPTIONS") {
      chrome.storage.local.get(
        ["unloopSubscriptions"],
        result => {
          sendResponse({
            success: true,
            subscriptions: Array.isArray(result.unloopSubscriptions)
              ? result.unloopSubscriptions
              : []
          });
        }
      );

      return true;
    }

    if (request.action === "SAVE_SUBSCRIPTION") {
      chrome.storage.local.get(
        ["unloopSubscriptions"],
        result => {
          const subscriptions = Array.isArray(
            result.unloopSubscriptions
          )
            ? result.unloopSubscriptions
            : [];

          const exists = subscriptions.some(
            item => item.id === request.subscription.id
          );

          if (!exists) {
            subscriptions.push(request.subscription);
          }

          chrome.storage.local.set(
            { unloopSubscriptions: subscriptions },
            () => {
              sendResponse({
                success: !chrome.runtime.lastError,
                message: chrome.runtime.lastError
                  ? chrome.runtime.lastError.message
                  : "Subscription saved successfully."
              });
            }
          );
        }
      );

      return true;
    }

    if (request.action === "DELETE_SUBSCRIPTION") {
      chrome.storage.local.get(
        ["unloopSubscriptions"],
        result => {
          const subscriptions = Array.isArray(
            result.unloopSubscriptions
          )
            ? result.unloopSubscriptions
            : [];

          const updatedSubscriptions = subscriptions.filter(
            item => item.id !== request.id
          );

          chrome.storage.local.set(
            { unloopSubscriptions: updatedSubscriptions },
            () => {
              sendResponse({
                success: !chrome.runtime.lastError,
                message: chrome.runtime.lastError
                  ? chrome.runtime.lastError.message
                  : "Subscription deleted successfully."
              });
            }
          );
        }
      );

      return true;
    }
  }
);