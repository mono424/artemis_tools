chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.ib, {
		file: 'vendor/download.js'
	});
	chrome.tabs.executeScript(tab.ib, {
		file: 'vendor/axios.min.js'
	});
	chrome.tabs.executeScript(tab.ib, {
		file: 'src/inject/inject.js'
	});
});