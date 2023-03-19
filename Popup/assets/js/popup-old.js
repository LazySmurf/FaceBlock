const channel = new BroadcastChannel('AppState');
function GetState() {
    channel.postMessage({ msg: 'GetState'})
    channel.onmessage = (msg) => {
        console.log('[BGW]: ', msg);
        channel.postMessage({ msg: 'GotState'})
        SetState(msg["data"]["msg"]);
        return msg;
    };
}

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

setInterval(GetState, 100);