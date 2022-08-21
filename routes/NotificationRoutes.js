const express = require('express');
const notificationController = require('../controllers/notificationController');
const isLogin = require("../middleware/is-login");


const notificationRouter = express.Router();

notificationRouter.get('/Notifications', isLogin, notificationController.getAllNotifications);
notificationRouter.post('/', notificationController.getNotifications);
notificationRouter.get('/solicitude/:friendRequestId/:userId/:friendID',notificationController.solicitudeFriend);


module.exports = notificationRouter;