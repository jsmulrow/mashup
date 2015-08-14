'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
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
		indexes: [Number]
	}],
	// options for crawled data
	config: {
		// concat data fields into an array of objects
		returnObj: {
			type: Boolean,
			default: false
		},
		// limit number of results
		limitNum: {
			type: Number
		}
	},


	//extra information about the crawler
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
			self.lastTimeCrawled = Date.now()
			self.lastCrawlSucceeded = false;
			self.save()
			console.log('there was an error in getCrawlData method');
		});
};

mongoose.model('Route', schema);