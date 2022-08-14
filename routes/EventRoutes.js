const express = require('express');

const router = express.Router();

const eventController = require('../controllers/EventController');

router.get("/events",eventController.GetAllEvents);


module.exports = router;
