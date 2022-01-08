chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.setStatus != undefined) {
    if (request.setStatus) {
      window.chrome.browserAction.setBadgeText({ text: "开启" });
      window.chrome.browserAction.setBadgeBackgroundColor({
        color: "#531dab",
      });
    } else {
      window.chrome.browserAction.setBadgeText({ text: "关闭" });
      window.chrome.browserAction.setBadgeBackgroundColor({
        color: "#595959",
      });
    }
  }
});
