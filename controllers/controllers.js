//setting up express
const express = require("express");
const app = express();
const path = require("path");

//setting up cheerio for the scrapping
const cheerio = require("cheerio");
const request = require("request");
var url = "https://abc13.com/houston/";

//setting up mongojs
const mongojs = require("mongojs");
const databaseUrl = "mongoScrapeHW";
const collections = ["saveArticles"];
const db = mongojs(databaseUrl, collections);

module.exports = function(app){
	app.get("/", function (req, res){

		res.sendFile(path.join(__dirname + "/../public/", "index.html"));
	});

	app.get("/news", function (req, res){
		request(url, function(err, resp, body){
			var $ = cheerio.load(body);
			var newsArr = [];

			$(".headline").each(function(i, element){
				var news = {
					headline: element.children[0].data,
					url: "http://abc13.com" + element.parent.attribs.href
				}

				newsArr.push(news);
			});
			newsArr.pop();
			newsArr.pop();
			res.send(newsArr);
		});
	});

	app.post("/saving", function (req, res){
		db.saveArticles.insert(req.body);
	});

	app.get("/saved", function (req, res){
		db.saveArticles.find({}, function(error, found) {
	    // Throw any errors to the console
	    if (error) {
	      console.log(error);
	    }
	    // If there are no errors, send the data to the browser as a json
	    else {
				res.render("index", {found});
	    }
		});
	});

	app.get("/notes/:id", function (req, res){
		db.saveArticles.find(db.ObjectId(req.params.id)  , function(error, found){
			if (error) {
				console.log(error);
			}
			// If there are no errors, send the data to the browser as a json
			else {
				res.send(found);
			}
		});
	});

	app.post("/addNotes/:id", function (req, res){
		db.saveArticles.update({_id: db.ObjectId(req.params.id)}, {$push: req.body}, function(error, done){
			if (error) {
				console.log(error);
			}
		});
	});

	app.post("/delArt/:id", function(req, res){
		db.saveArticles.remove( {_id: db.ObjectId(req.params.id)}, function(error, done){
			if (error) {
				console.log(error);
			} else {
				res.send({reload: true});
			}
		});
	});

	app.post("/delNote/:id/:index", function(req, res){
		db.saveArticles.find({_id: db.ObjectId(req.params.id)}, function(error, found){
			if (error) {
				console.log(error);
			} else {
				var newArr = [];

				for(var i = 0; i<found[0].note.length; i++){
					if(i !== parseInt(req.params.index)){
						newArr.push(found[0].note[i]);
					}
				}

				db.saveArticles.update({_id: db.ObjectId(req.params.id)}, {$set: {note: newArr}}, function(error, found){
					if (error) {
						console.log(error);
					} else {
						res.send({reload: true});
					}
				});
			}
		})
	});
}
