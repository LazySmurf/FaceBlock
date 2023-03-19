var CURR_STATE;
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "OFF",
    });
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
            boolState = chrome.runtime.getManifest().name + " - Enabled";
            CURR_STATE = nextState;
            break;
        case "OFF":
            boolState = chrome.runtime.getManifest().name + " - Disabled";
            CURR_STATE = nextState;
            break;
        default:
            boolState = chrome.runtime.getManifest().name + " - Error";
            CURR_STATE = "ERROR";
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
var Sendlist = [];
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ? "View:" + sender.tab.url : "BGW:", request);
    
    console.log("[%cBGW%c]: %cNew Message!%c\n%cChannel%c: " + Object.keys(request)[0] + "\n  ↳ %cMessage%c: " + Object.values(request)[0], "background-color: orange; color: black;", "", "background-color: green; color: lime;", "", "background-color: purple; color: black;", "", "background-color: cyan; color: black;", "" );

    //If the message we receive is on the RequestSubscribe channel, it will contain a Tab ID to be added to the sendlist.
    //We will add the Tab ID to the sendlist, and reply to the tab that it's been added.
    //When the tab knows that it's been added, it will let us know on the SubscribeConfirm channel with it's Tab ID again,
    //to confirm that the tab associated with that Tab ID has recieved the message. IF it does not reply on this channel,
    //we will remove it from the sendlist.

    //RequestSubscribe
    if (request.RequestSubscribe) {
        if (Sendlist.indexOf(request.RequestSubscribe) > -1 && request.RequestSubscribe != LastSubscribeRequest) {
            Logger("Already subscribed! Letting view know it's already on the list...");
            sendResponse({SubscribedToSendlist: "_subbed"});
        } else {
            LastSubscribeRequest = request.RequestSubscribe;
            Logger(LastSubscribeRequest + " is Requesting to Subscribe");
            //Add to sendlist and send response
            Sendlist.push(request.RequestSubscribe);
            Logger("Subscribed to Sendlist, sending confirmation...");
            sendResponse({SubscribedToSendlist: request.RequestSubscribe});
        }
    }

    //SubscribeConfirm
    if (request.SubscribeConfirm && LastSubscribeRequest) { //If the received message is on the SubscribeConfirm channel, and LastStateRequest is set
        if (request.SubscribeConfirm == LastSubscribeRequest) { //Check if the Tab ID in the message matches the last RequestSubscribe request we stored in LastStateRequest
            Logger("Subscription for " + LastSubscribeRequest + " confirmed!"); //If they match, then subscription confirmed
            // var UpdateView = [LastSubscribeRequest];
            // var UpdateResult = SendStateToTabs(UpdateView);
            var UpdateResult = SendStateToTab(LastSubscribeRequest);

            if (UpdateResult) {
                Logger(UpdateResult);
            } else {
                Logger("Error updating tab ID " + LastSubscribeRequest);
            }
            LastSubscribeRequest = null; //Clear the last request since it has been fulfilled.
        } else {
            Logger("Invalid Subscription Confirmation. Removing " + LastSubscribeRequest + " from Sendlist.");
            const index = Sendlist.indexOf(LastSubscribeRequest);
            if (index > -1) { // only splice array when item is found
                array.splice(index, 1); // 2nd parameter means remove one item only
            }
            sendResponse({SubscribeError: request.SubscribeConfirm});
            LastSubscribeRequest = null; //Clear the last request since it wasn't confirmed
        }
    }

    //RequestState
    if (request.RequestState) {
        Logger("State request received from " + request.RequestState, request);
        sendResponse({StateUpdate: CURR_STATE});
        Logger("Response sent!\t\tStateUpdate: ", CURR_STATE);
    }

  }
);

//These are not working due to an issue sending messages between background.js and the popup,
//because the content scripts that it's allowed to talk to need to be defined in the manifest
//and I'm not sure how to define the popup, but it keeps returning this error:
//Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
/*
//Send To One View
async function SendStateToTab(TabID) {
    chrome.tabs
    .sendMessage(TabID, { StateUpdate: CURR_STATE })
    .then((response) => {
      console.log("Message from the content script:");
      console.log(response.response);
    })
    .catch(onError);

    if (onError) {
        Logger("There was an error sending the state.", onError);
    } else {
        if (response) {
            Logger("Response:", response);
        } else {
            Logger("No error, but no response.");
        }
    }
}

//Send To All On Sendlist
function SendStateToTabs(tabs) {
    for (const tab of tabs) {
      chrome.tabs
        .sendMessage(tab.id, { StateUpdate: CURR_STATE })
        .then((response) => {
          console.log("Message from the content script:");
          console.log(response.response);
        })
        .catch(onError);

        if (onError) {
            Logger("There was an error sending the state.", onError);
        } else {
            if (response) {
                Logger("Response:", response);
            } else {
                Logger("No error, but no response.");
            }
        }
    }
}
*/

/////////////////////////
//  Logger  //   BGW   //
/////////////////////////
function Logger(msg, obj) {
    if (obj) {
        console.log("[%cBGW%c]: " +  msg, "background-color: orange; color: black;", "font-weight: normal;", obj);
    } else {
        console.log("[%cBGW%c]:" + msg, "background-color: orange; color: black;", "");
    }
}