var appConfig = {};
if (window.location.hostname == "localhost") {
    appConfig = {
        // apiUrl: "http://localhost:57555/api",
        // authUrl: "http://localhost:57555",
        apiUrl: "http://148.72.64.161:443/api",
        authUrl: "http://148.72.64.161:443",
    }
} else {
    appConfig = {
        apiUrl: "http://148.72.64.161:443/api",
        authUrl: "http://148.72.64.161:443",
        imagePath: "",
    }
    applyLiveSettings();
}

function applyLiveSettings() {
    console.log = function (log) {

    };
}