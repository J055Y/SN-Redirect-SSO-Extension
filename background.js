chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
        chrome.storage.local.get([tabId.toString()], function (item) {
            var oldUrl = item[tabId.toString()];
            if (oldUrl) {
                let found = oldUrl.split("?")[0].match(/^https:\/\/(.+?)\.service-now\.com\/auth_redirect\.do/);
                if (found) {
                    chrome.storage.local.get(["instance_names"], function (item) {
                        console.log(item);
                        if (Array.isArray(item.instance_names)) {
                            if (!item.instance_names.includes(found[1])) {
                                if (tab.url.startsWith("https://login.microsoftonline.com/")) {
                                    chrome.tabs.update(tabId, {
                                        url: "https://" + found[1] + ".service-now.com/login.do"
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
        chrome.storage.local.set(JSON.parse('{"' + tabId + '": "' + tab.url + '"}'));
    }
});