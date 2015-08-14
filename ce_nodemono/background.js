chrome.browserAction.onClicked.addListener(function(tab) {
	// console.log($.toString());
	// $("body").append('<p>Test</p>');
	// console.log($("body"));
	// console.log(tab);

	//inject angularjs

	chrome.tabs.executeScript(tab.id, {
		code: 'window.name = "NG_DEFER_BOOTSTRAP!" + window.name;'
	})
	chrome.tabs.executeScript(tab.id, {
		file: "angular.min.js"
	});
	chrome.tabs.executeScript(tab.id, {
		file: "jquery.min.js"
	});

	chrome.tabs.executeScript(tab.id, {
		file: "selectorgadget/selectorgadget_combined.js"
	});


	chrome.tabs.executeScript(tab.id, {
		file: "nodemono.js"
	});
	// chrome.tabs.executeScript(tab.id, {
	// 	file: "selectorgadget.js"
	// });
	// alert('hi');
});

chrome.browserAction.onClicked.removeListener();