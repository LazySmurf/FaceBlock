var years = document.getElementsByClassName("year");
for (var i = 0; i < years.length; i++) {
    years[i].innerHTML = new Date().getFullYear();
}

var versions = document.getElementsByClassName("version");
for (var i = 0; i < versions.length; i++) {
    versions[i].innerHTML = chrome.runtime.getManifest().version_name;
}

var apps = document.getElementsByClassName("app");
for (var i = 0; i < apps.length; i++) {
    apps[i].innerHTML = chrome.runtime.getManifest().name;
}