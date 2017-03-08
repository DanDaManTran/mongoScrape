//setting up express
const express = require("express");
const app = express();
const path = require("path");

//setting up cheerio for the scrapping
const cheerio = require("cheerio");
const request = require("request");
var url = "https://abc13.com/houston/";

module.exports = function(app){
	app.get("/", function (req, res){

		res.sendFile(path.join(__dirname + "/../public/", "index.html"));
	});

	app.get("/news", function (req, res){
		request(url, function(err, resp, body){
			var $ = cheerio.load(body);
			var title = $(".headline");
		 	for(var i = 0; i<title.length; i++){
				console.log(title[i].children[0].data);
				console.log("http://abc13.com" + title[i].parent.attribs.href);
			}// gotta fix the html output some of them have the beggining repeated

		});
	})
}
