const express = require('express');
const notificationController = require('../controllers/notificationController');


const notificationRouter = express.Router();

notificationRouter.get('/notification', notificationController.getNotifications);

module.exports = notificationRouter;