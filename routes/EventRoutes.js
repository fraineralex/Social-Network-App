const express = require('express');

const router = express.Router();

const eventController = require('../controllers/EventController');

router.get("/events",eventController.GetAllEvents);
router.get("/events-created",eventController.GetCreatedEvents);
router.get("/create-event",eventController.GetCreateEvent);
router.post("/create-event",eventController.PostCreateEvent);
router.post("/delete-event",eventController.PostDeleteEvent);
router.get("/add-invited/:AuthorId/:EventId",eventController.GetAddInvited);
router.post("/add-invited",eventController.PostAddInvited);



module.exports = router;
