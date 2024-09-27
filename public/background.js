chrome.runtime.onInstalled.addListener(() => {
  console.log("Flash Notes extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateBadge") {
    const count = request.count;
    chrome.action.setBadgeText({ text: count > 0 ? count.toString() : "" });
    chrome.action.setBadgeBackgroundColor({ color: "#EF4444" }); // Bright red background
    chrome.action.setBadgeTextColor({ color: "#FFFFFF" }); // White text
  }
});

// Set default badge style
chrome.action.setBadgeBackgroundColor({ color: "#EF4444" }); // Bright red background
chrome.action.setBadgeTextColor({ color: "#FFFFFF" }); // White text

// Add any background tasks or event listeners here
