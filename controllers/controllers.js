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
			$(".headline").each(function(i, element){
				console.log(element.children[0].data);
				console.log("http://abc13.com" + element.parent.attribs.href);
			});
		});
	})
}
