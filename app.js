const path = require("path");
const express = require("express");
const expressHbs = require("express-handlebars");
const sequelize = require("./util/database");
const relationships = require("./models/RelationShips");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();

const getDataHelpers = require("./util/helpers/GetData");

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      findName: getDataHelpers.FindName,
      findImageProfile: getDataHelpers.FindImageProfile,
      getDate: getDataHelpers.GetDate,
    },
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));
app.use("/images",express.static(path.join(__dirname, "images")));

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

app.use(multer({ storage: imageStorage }).single("ImageFile"));

const errorController = require("./controllers/ErrorController");
const homeRouter = require("./routes/Home");
const friendRouter = require("./routes/FriendRoutes");

app.use(homeRouter);
app.use(friendRouter);
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