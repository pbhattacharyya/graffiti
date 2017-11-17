chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "BROWSER_ACTION_ONCLICKED"
        }, handleResponse);
    });
});

// TODO: Figure out why this doesn't get called
function handleResponse(response) {
    console.log("response:" + response);
    var iconSet = repsonse.isActive
    ? {
        "16": "icon16.png",
        "48": "icon48.png",
        "128": "icon128.png"
    }
    : {
        "16": "icon-off16.png",
        "48": "icon-off48.png",
        "128": "icon-off128.png"
    };
    chrome.browserAction.setIcon({path: iconSet, tabId: tabs[0].id});
}