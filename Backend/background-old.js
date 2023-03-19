var CURR_STATE;
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "OFF",
    });
    CURR_STATE = "OFF";
});

chrome.tabs.onUpdated.addListener(async function
    (tabId, changeInfo, tab) {
        /*****/
        let facebookURL = "https://facebook.com";
        let facebookURLwww = "https://www.facebook.com";
        // read changeInfo data and do something with it (like read the url)
        if (changeInfo.url) {
            if (changeInfo.url.startsWith(facebookURL) || changeInfo.url.startsWith(facebookURLwww)) {
                // Set the action badge to the ON state if URL is Facebook
                setState(tab.id, "ON");

                //Inject modal script into page and execute it
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["/Modal/assets/js/ModalLoader.js"]
                });
            } else {
                // Set the action badge to the OFF state if URL isn't Facebook
                setState(tab.id, "OFF");
            }
        }
        /*****/
    }
);

function setState(tabID, nextState) {
    switch (nextState) {
        case "ON":
            CURR_STATE = "ON";
            boolState = chrome.runtime.getManifest().name + " - Enabled";
            break;
        case "OFF":
            CURR_STATE = "OFF";
            boolState = chrome.runtime.getManifest().name + " - Disabled";
            break;
        default:
            CURR_STATE = "ERROR";
            boolState = chrome.runtime.getManifest().name + " - Error";
            break;
    }
    chrome.action.setBadgeText({
        tabId: tabID,
        text: nextState
    });
    chrome.action.setTitle({
        tabId: tabID,
        title: boolState
    });
}

//Update Views
const channel = new BroadcastChannel('AppState');
channel.onmessage = (msg) => {
    console.log('[VIEW]: ', msg);
    channel.postMessage({ msg: CURR_STATE});
};