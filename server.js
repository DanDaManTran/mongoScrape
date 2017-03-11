//setting up express
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static(path.join(__dirname, "/public/")));
require("./controllers/controllers.js")(app);

//connecting with handlebars 
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//syncing mongojs
const mongojs = require("mongojs");
const databaseUrl = "mongoScrapeHW";
const collections = ["saveArticles"];
const db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});


app.listen(process.env.PORT || PORT);
