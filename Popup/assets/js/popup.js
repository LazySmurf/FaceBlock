//////////////////////////////////////////////////////////////////////////////////////
////                                  Tab Handler                                 ////
//////////////////////////////////////////////////////////////////////////////////////
//Set variable to store TabID, then run function to grab it asynchronously
/* var CurrentTabID;
function start() {
    return getCurrentTab();
}
  
// Call start
(async() => {
    Logger('Asking for Tab ID...');
  
    var tab = await start();
    var tabID = tab['id'];
    Logger("TabID:", tabID);
    CurrentTabID = tabID; //Set CurrentTabID after we update the Logger so that we can see the default change into the ID in the log
    // SendTabIDToBGW(tabID);
    RequestState();
})();

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
} */


//////////////////////////////////////////////////////////////////////////////////////
////                               Message Handler                                ////
//////////////////////////////////////////////////////////////////////////////////////
////                                 Description                                  ////
////                                                                              ////
//// The communication protocol works by initializing a handshake between the     ////
//// View and the Background Worker, then the Background Worker sends updates to  ////
//// the View, and the View confirms delivery. If the View fails to confirm       ////
//// delivery, it is removed from the sendlist the Background Worker sends        ////
//// updates to. It can be re-added to the sendlist by again sending a handshake  ////
//// request to the Background Worker on the RequestSubscribe channel. This       ////
//// request should be made at the start of each view's script if it needs the    ////
//// app state.                                                                   ////
//////////////////////////////////////////////////////////////////////////////////////
////                                  Channels:                                   ////
////                                                                              ////
////                                                                              ////
////        For Handshake:                                                        ////
////                                                                              ////
//// RequestSubscribe - used by a View to send it's Tab ID to the Background      ////
//// Worker to request being added to the sendlist. It's message contains the     ////
//// Tab ID of the tab sending the message on the RequestSubscribe channel.       ////
////                                                                              ////
//// SubscribedToSendlist - used by the Background Worker in reply to a           ////
//// RequestSubscribe message. It's message on this channel contains the Tab ID   ////
//// of the tab added to the sendlist by the Background Worker.                   ////
////                                                                              ////
//// SubscribeConfirm - used by the View in reply to the SubscribedToSendlist     ////
//// message. The message contains the Tab ID of the View confirming it's receipt ////
//// of the SubscribedToSendlist message from the Background Worker. Failure to   ////
//// reply on the SubscribeConfirm channel will result in the Tab ID being        ////
//// removed from the sendlist.                                                   ////
////                                                                              ////
//// SubscribeError - used by the Background Worker to inform tabs of an error    ////
//// with validating their subscription. The message will contain the ID of the   ////
//// tab that tried to subscribe but failed. A good response to this from the tab ////
//// is to re-initiate the handshake (from the start!)                            ////
////                                                                              ////
////                                                                              ////
////        For App State Updates:                                                ////
////                                                                              ////
//// StateUpdate - used by the Background Worker when the App State is updated to ////
//// send the new State to all views subscribed to the Sendlist. It's message     ////
//// contains the new App State.                                                  ////
////                                                                              ////
//// DeliveryStatus - used by the Views to confirm their receipt of the new App   ////
//// State from the StateUpdate channel. Views on the sendlist which do not reply ////
//// on the DeliveryStatus channel will be removed from the sendlist. Message     ////
//// contains the Tab ID of the view confirming delivery.                         ////
//////////////////////////////////////////////////////////////////////////////////////


//Turns out, at least for now, simple is best. The call-and-response method works well for this simple request.
/* async function RequestState2() {
        Logger("Requesting state from BGW...");
        const response = await chrome.runtime.sendMessage({RequestState: CurrentTabID});
        if (response.StateUpdate) {
            Logger("Response from BGW:", response);
            Logger("Current App State is ", response.StateUpdate);
            SetState(response.StateUpdate);
        } else { 
            Logger("Unexpected Response:", response);
        }
} */
function RequestState() {
    (async () => {
        console.log("");
        Logger("Sending State Request to BGW...");
        const response = await chrome.runtime.sendMessage({RequestState: "popup.js"});
        if (response.StateUpdate) {
            Logger("Response from BGW:", response);
            Logger("App State:", response.StateUpdate);
            SetState(response.StateUpdate);
        } else {
            Logger("Invalid Response:", response);
            SetState("ERROR");
        }
    })();
}
setInterval(RequestState, 1000);

/* function SendTabIDToBGW(tabID) { //We only send our Tab ID once at the start of the handshake, after which it's added to the sendlist
    (async () => {
        Logger("Sending Tab ID to BGW...");
        const response = await chrome.runtime.sendMessage({RequestSubscribe: tabID});
        if (response.SubscribedToSendlist === tabID) {
            Logger("Response from BGW:", response);
            Logger("Sending subscription confirmation...");
            await chrome.runtime.sendMessage({SubscribeConfirm: tabID});
        } else if (response.SubscribedToSendlist === "_subbed") {
            //already subscribed
            Logger("Already subscribed!");
        }
    })();
} */

/* chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        // console.log(sender.tab ? "View:" + sender.tab.url : "BGW:", request);
        Logger("Incoming Message", request);
        if (request.SubscribeError == CurrentTabID) {
            Logger("Subscribe error, retrying handshake...");
            SendTabIDToBGW(CurrentTabID);
        }
        if (request.StateUpdate) {
            sendResponse({DeliveryStatus: CurrentTabID});
            SetState(request.StateUpdate);
            console.log("State Updated: " + request.StateUpdate);
            chrome.runtime.sendMessage({DeliveryStatus: CurrentTabID});
        }
    }
); */


//////////////////////////////////////////////////////////////////////////////////////
////                                 View Updater                                 ////
//////////////////////////////////////////////////////////////////////////////////////
function SetState(state) {
    var appstates = document.getElementsByClassName("appstate");
    var stateCopy, stateColour;
    switch (state) {
        case "ON":
            stateCopy = "Enabled";
            stateColour = "appstate text-info";
            break;
        case "OFF":
            stateCopy = "Disabled";
            stateColour = "appstate text-warning";
            break;
        case "ERROR":
            stateCopy = "Error";
            stateColour = "appstate text-danger";
            break;
        default:
            stateCopy = "Loading";
            stateColour = "appstate text-muted";
            break;
    }
    for (var i = 0; i < appstates.length; i++) {
        appstates[i].className = stateColour;
        appstates[i].innerHTML = stateCopy;
    }
}

//////////////////////////////////////////////////////////////////////////////////////
////                                    Logger                                    ////
//////////////////////////////////////////////////////////////////////////////////////
function Logger(msg, obj) {
    if (obj) {
        console.log("[%cpopup.js%c]:" + msg, "background-color: cyan; color: black;", "", obj);
    } else {
        console.log("[%cpopup.js%c]:" + msg, "background-color: cyan; color: black;", "");
    }
}