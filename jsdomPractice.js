var jsdom = require('node-jsdom');
var request = require('request');
var Q = require('q');
var _ = require('lodash');

// return promise for a url's html
function getUrl(url) {
	var deferred = Q.defer();
	request(url, function(err, res, body) {
		if (err) deferred.reject(err);
		else deferred.resolve(body);
	});
	return deferred.promise;
}

var dummyUrl = 'http://www.espn.go.com';

getUrl(dummyUrl).then(function(html) {
	// jsdom provides access to the window object
	jsdom.env(html, function(err, window) {
		// get the selected elements - convert to an array too
		var selected = Array.prototype.slice.call(window.document.querySelectorAll('body div section#pane-main section#main-container div .container-wrapper .container article .headlines ul li a'));
		selected = selected.map(function(elem) {
			return elem.textContent;
		});
		console.log(selected);
	});

});

// dom elements don't support most array prototype methods
// function 
function forEachNode(nodeArr, func) {
	var l = nodeArr.length;
	for (var i = 0; i < l; i++) {
		func(nodeArr);
	}
}
function mapNode(nodeArr, func) {
	var l = nodeArr.length;
	for (var i = 0; i < l; i++) {
		nodeArr[i] = func(nodeArr[i]);
	}
	return nodeArr;
}
