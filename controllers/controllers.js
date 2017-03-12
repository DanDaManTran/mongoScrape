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
//***********************depending if you are doing a local host or heroku this depends on the switch
// const databaseUrl = "mongoScrapeHW";
const databaseUrl = "mongodb://heroku_27j86b0b:82fu6h1k65crrmu2070ouua0v4@ds129050.mlab.com:29050/heroku_27j86b0b";
//***************************************************************************************************
const collections = ["saveArticles"];
const db = mongojs(databaseUrl, collections);

module.exports = function(app){
	//setting up the home page for the live feed
	app.get("/", function (req, res){
		res.sendFile(path.join(__dirname + "/../public/", "index.html"));
	});

	//something for heroku. Its a favicon stuff
	app.get("/favicon.ico", function(req, res){
		res.send(204);
	});

	//this is to get the scraped news and pushing it to the front end to desplay
	app.get("/news", function (req, res){
		request(url, function(err, resp, body){
			var $ = cheerio.load(body);
			var newsArr = [];

			$(".headline").each(function(i, element){
				var news = {
					headline: element.children[0].data,
					url: "http://abc13.com" + element.parent.attribs.href
				};

				newsArr.push(news);
			});

			//the last 2 news are not actually news
			newsArr.pop();
			newsArr.pop();
			res.send(newsArr);
		});
	});

	//taking the post to insert it into the database
	app.post("/saving", function (req, res){
		db.saveArticles.insert(req.body);
	});

	//pulling all the articles that is saved in the database so it can be desplay on the /saved page
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

	//this will grab all the notes for that article and push it to the front side to so it can be displayed
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

	//this will update the note array at the specific article
	app.post("/addNotes/:id", function (req, res){
		db.saveArticles.update({_id: db.ObjectId(req.params.id)}, {$push: req.body}, function(error, done){
			if (error) {
				console.log(error);
			}
		});
	});

	//this will delete the specific article
	app.post("/delArt/:id", function(req, res){
		db.saveArticles.remove( {_id: db.ObjectId(req.params.id)}, function(error, done){
			if (error) {
				console.log(error);
			} else {
				res.send({reload: true});
			}
		});
	});

	//this will delete the specific note from the array of notes
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
		});
	});
};
