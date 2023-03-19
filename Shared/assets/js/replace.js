//replace.js is used to support other views and content scripts within the app.
//It's purpose is to find elements with certain classes and replace the contents
//of those elements with details from the back-end, mostly info about the app
//from the manifest.json file.

//Replaces contents of all elements with class "year" to contain the current year
var years = document.getElementsByClassName("year");
for (var i = 0; i < years.length; i++) {
    years[i].innerHTML = new Date().getFullYear();
}

//Replaces contents of all elements with class "version" to contain the app version from the manifest
var versions = document.getElementsByClassName("version");
for (var i = 0; i < versions.length; i++) {
    versions[i].innerHTML = chrome.runtime.getManifest().version_name;
}

//Replaces contents of all  elements with class "app" to contain the app name from the manifest
var apps = document.getElementsByClassName("app");
for (var i = 0; i < apps.length; i++) {
    apps[i].innerHTML = chrome.runtime.getManifest().name;
}

//Replaces the href attribute of all <a> elements with class "appurl" to contain the app url from the manifest
var appurl = document.getElementsByClassName("appurl");
for (var i = 0; i < appurl.length; i++) {
    appurl[i].href = chrome.runtime.getManifest().homepage_url;
}