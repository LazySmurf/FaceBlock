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

    
};

var LastSubscribeRequest;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ? "View:" + sender.tab.url : "BGW:", request);
    Logger("Incoming Message:", request);

    //If the message we receive is on the RequestSubscribe channel, it will contain a Tab ID to be added to the sendlist.
    //We will add the Tab ID to the sendlist, and reply to the tab that it's been added.
    //When the tab knows that it's been added, it will let us know on the SubscribeConfirm channel with it's Tab ID again,
    //to confirm that the tab associated with that Tab ID has recieved the message. IF it does not reply on this channel,
    //we will remove it from the sendlist.

    //RequestSubscribe
    if (request.RequestSubscribe) {
        LastSubscribeRequest = request.RequestSubscribe;
        Logger(LastSubscribeRequest + " is Requesting to Subscribe");
        //Add to sendlist and send response
        Logger("Subscribed to Sendlist, sending confirmation...");
        sendResponse({SubscribedToSendlist: request.RequestSubscribe});
    }

    //SubscribeConfirm
    if (request.SubscribeConfirm && LastSubscribeRequest) { //If the received message is on the SubscribeConfirm channel, and LastStateRequest is set
        if (request.SubscribeConfirm == LastSubscribeRequest) { //Check if the Tab ID in the message matches the last RequestSubscribe request we stored in LastStateRequest
            Logger("Subscription for " + LastSubscribeRequest + " confirmed!"); //If they match, then subscription confirmed
            LastSubscribeRequest = null; //Clear the last request since it has been fulfilled.
        } else {
            Logger("Invalid Subscription Confirmation. Removing " + LastSubscribeRequest + " from Sendlist.");
            LastSubscribeRequest = null; //Clear the last request since it wasn't confirmed
        }
    }

  }
);

function Logger(msg, obj) {
    if (obj) {
        console.log("[%cBGW%c]:", "background-color: orange; color: black;", "font-weight: normal;", msg, obj);
    } else {
        console.log("[%cBGW%c]:", "background-color: orange; color: black;", "", msg);
    }
}