const path = require("path");
const express = require("express");
const expressHbs = require("express-handlebars");
const sequelize = require("./util/database");
const relationships = require("./models/RelationShips");
const errorController = require("./controllers/ErrorController");

const app = express();

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({extended: false}));

const homeRouter = require("./routes/Home");
app.use(homeRouter);


app.use(express.static(path.join(__dirname, "public")));


app.use(errorController.Get404);

relationships.RelationShips();


sequelize
  .sync()
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });