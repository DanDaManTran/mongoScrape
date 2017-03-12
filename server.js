//setting up express
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

//setting up the bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//setting up the paths for the assets files
app.use(express.static(path.join(__dirname, "/public/")));

//setting up the routes from the controllers.js
require("./controllers/controllers.js")(app);

//connecting with handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//syncing with mongojs
const mongoose = require("mongoose");
mongoose.Promise = Promise;
//***************depending if you are doing a local host or heroku this depends on the switch
// mongoose.connect("mongodb://localhost/mongoScrapeHW");
mongoose.connect("mongodb://heroku_27j86b0b:82fu6h1k65crrmu2070ouua0v4@ds129050.mlab.com:29050/heroku_27j86b0b");
//***************************************************************************************************
var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//setting up the PORT
app.listen(PORT);
