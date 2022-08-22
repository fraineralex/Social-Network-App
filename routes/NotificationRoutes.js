const express = require('express');
const notificationController = require('../controllers/notificationController');
const isLogin = require("../middleware/is-login");


const notificationRouter = express.Router();

notificationRouter.get('/Notifications', isLogin, notificationController.getAllNotifications);
notificationRouter.post('/', notificationController.getNotifications);
notificationRouter.get('/solicitude/:friendRequestId/:userId/:friendID',notificationController.solicitudeFriend);

notificationRouter.get('/notifications/acceptFriend/:idNotification', notificationController.acceptFriend);
notificationRouter.get('/notifications/deleteNotification/:idNotification', notificationController.deleteNotification);
notificationRouter.get('/notifications/viewNotifications/:idNotification', notificationController.viewNotifications);


module.exports = notificationRouter;