const express = require('express');
const notificationController = require('../controllers/notificationController');
const isLogin = require("../middleware/is-login");


const notificationRouter = express.Router();

notificationRouter.get('/Notifications', isLogin, notificationController.getAllNotifications);
notificationRouter.post('/',isLogin, notificationController.getNotifications);
notificationRouter.get('/solicitude/:friendRequestId/:userId/:friendID', isLogin, notificationController.solicitudeFriend);

notificationRouter.get('/notifications/acceptFriend/:idNotification',isLogin, notificationController.acceptFriend);
notificationRouter.get('/delete-Notifications/:idNotification',isLogin, notificationController.deleteNotification);
notificationRouter.get('/notifications/viewNotifications/:idNotification',isLogin, notificationController.viewNotifications);


module.exports = notificationRouter;