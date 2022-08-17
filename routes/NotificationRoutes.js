const express = require('express');
const notificationController = require('../controllers/notificationController');


const notificationRouter = express.Router();

notificationRouter.post('/', notificationController.getNotifications);
notificationRouter.post('/solicitude/friend/:userId/:friendID', notificationController.solicitudeFriend);


module.exports = notificationRouter;