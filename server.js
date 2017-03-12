//setting up express
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

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

//syncing with mongojs
// mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/mongoScrapeHW");
mongoose.connect("mongodb://heroku_27j86b0b:82fu6h1k65crrmu2070ouua0v4@ds129050.mlab.com:29050/heroku_27j86b0b");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


app.listen(process.env.PORT || PORT);
