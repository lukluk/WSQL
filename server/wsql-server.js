var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');

exports.start = function(port) {
    app.get('/api/index.json', function(req, res) {
    	
    });
    var server = app.listen(port, function() {
        console.log("WAQL service ready"+" ("+server.address().port+")");
        
    });
}
