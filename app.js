//dotenv
require('dotenv').config();

const express = require("express");
const morgan = require("morgan");
const path = require("path");
const expressHbs = require("express-handlebars");
const sequelize = require("./util/database");
const relationships = require("./models/RelationShips");
const Users = require("./models/Users");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const flash = require("connect-flash");
const getDataHelpers = require("./util/helpers/GetData");
const getConfirmation = require("./util/helpers/friendConfirmation");
const getNotificationsInfo = require("./util/helpers/NotificationInfo");
const errorController = require("./controllers/ErrorController");
const homeRouter = require("./routes/Home");
const friendRouter = require("./routes/FriendRoutes");
const notificationRouter = require("./routes/NotificationRoutes");
const eventRouter = require("./routes/EventRoutes");
const login_intRouter = require("./routes/Login_int");

// Initialize express app
const app = express();

// Initialize express-handlebars
app.engine("hbs",expressHbs({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      findUser: getDataHelpers.FindUser,
      findImageProfile: getDataHelpers.FindImageProfile,
      getDate: getDataHelpers.GetDate,
      getEventDate: getDataHelpers.GetEventDate,
      findCommentsWithoutReplies: getDataHelpers.FindCommentsWithoutReplies,
      findOneCommentsWithoutReplies: getDataHelpers.FindOneCommentWithoutReplies,
      findReply: getDataHelpers.FindReply,
      findOneReply: getDataHelpers.FindOneReply,
      getConfirmationF: getConfirmation.friendConfirmation,
      lengthValue: getDataHelpers.LengthValue,
      findAnswer: getDataHelpers.FindAnswer,
      notificationInfoName: getNotificationsInfo.NotificationInfoName,
      notificationInfoUserName: getNotificationsInfo.NotificationInfoUserName, 
      notificationInfoImg: getNotificationsInfo.NotificationInfoImg,
      isEqual: getDataHelpers.IsEqual,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//static folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/images",express.static(path.join(__dirname, "images")));

//session
app.use(
  session({ secret: "anything", resave: true, saveUninitialized: false })
);
app.use(flash());

app.use((req, res, next) => {
  
  if (!req.session) {
    return next();
  }
  if (!req.session.user) {
    return next();
  }
  
  Users.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  const errors = req.flash("errors");  
  res.locals.isAuthenticated = req.session.newSession;
  res.locals.errorMessages = errors;
  res.locals.hasErrorMessages = errors.length > 0;
  

  next();
});

//multer
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

app.use(multer({ storage: imageStorage }).single("ImageFile"));

//routes
app.use(homeRouter);
app.use(friendRouter);
app.use(notificationRouter);
app.use(eventRouter);
app.use(login_intRouter);
app.use(errorController.Get404);

//db relationships
relationships.RelationShips();

//launches the server
sequelize.sync().then(result=> app.listen(5000)).catch((err) =>console.log(err));