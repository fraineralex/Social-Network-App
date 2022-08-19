const express = require('express');

const router = express.Router();

const eventController = require('../controllers/EventController');
const isLogin = require("../middleware/is-login");

//<<<<<<< HEAD
router.get("/events",isLogin, eventController.GetAllEvents);
router.get("/events-created",isLogin, eventController.GetCreatedEvents);
router.get("/create-event",isLogin, eventController.GetCreateEvent);
router.post("/create-event",isLogin, eventController.PostCreateEvent);
router.post("/delete-event",isLogin, eventController.PostDeleteEvent);
router.get("/add-invited/:AuthorId/:EventId",isLogin, eventController.GetAddInvited);
router.post("/add-invited",isLogin, eventController.PostAddInvited);
router.get("/view-invited/:AuthorId/:EventId",isLogin, eventController.GetViewInvited);
router.post("/assist/:Message",isLogin, eventController.PostMessageReceptor);
//=======
router.get("/events",isLogin, eventController.GetAllEvents);
router.get("/events-created",isLogin, eventController.GetCreatedEvents);
router.get("/create-event",isLogin, eventController.GetCreateEvent);
router.post("/create-event",isLogin, eventController.PostCreateEvent);
router.post("/delete-event",isLogin, eventController.PostDeleteEvent);
router.get("/add-invited/:AuthorId/:EventId",isLogin, eventController.GetAddInvited);
router.post("/add-invited",isLogin, eventController.PostAddInvited);
router.get("/view-invited/:AuthorId/:EventId",isLogin, eventController.GetViewInvited);
router.post("/assist/:Message",isLogin, eventController.PostMessageReceptor);
router.post("/delete-invited",isLogin, eventController.PostDeleteInvited);
//>>>>>>> a31e0f2f40046cc5c5f062aaa8f9cca661e54d3a



module.exports = router;
