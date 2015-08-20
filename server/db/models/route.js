'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	url: {
		type: String,
		required: true
	},
	data: [{
		name: String,
		selector: String,
		// optionally extract the attribute from selected elements
		attr: String,
		// optionally extract certain indexes from selected elements
		index: Number
	}],
	// limit is the number of times to "click" the pagination link
	pagination: [{
		link: String,
		limit: Number,
		index: Number
	}],
	// extra information about the crawler
	lastTimeCrawled: {
		type: Date,
		default: Date.now
	},
	lastCrawlSucceeded: {
		// true if successful, false if failed
		type: Boolean,
		default: true
	},
	count: {
		// times crawled
		type: Number,
		default: 0
	},
});


// add the crawl function to each mongoose route object
var crawl = require('../../app/functions/crawler');

// returns a promise for the crawled data, also updates crawling statistics
schema.methods.getCrawlData = function getCrawlData() {
	var self = this;
	// remember old pagination limits (weird mongo stuff happening here)
	var oldLimits = self.pagination.map(function(page) {
		return page.limit;
	});
	console.log(oldLimits);
	return crawl(self)
		.then(function(crawledData) {
			// update the last time crawled
			self.lastTimeCrawled = Date.now();
			self.lastCrawlSucceeded = true;
			self.count++;
			self.save();
			return crawledData;
		})
		.catch(function(err) {
			// the crawl failed, so log that
			self.lastTimeCrawled = Date.now();
			self.lastCrawlSucceeded = false;
			self.save();
			console.log('there was an error in getCrawlData method', err);
			return err;
		})
		.finally(function() {
			// reset limits to original values - get overwritten through pagination
			self.pagination.forEach(function(page, idx) {
				page.limit = oldLimits[idx];
			});
		});
};

mongoose.model('Route', schema);