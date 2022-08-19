const express = require('express');
const notificationController = require('../controllers/notificationController');
const isLogin = require("../middleware/is-login");


const notificationRouter = express.Router();

notificationRouter.post('/',isLogin, notificationController.getNotifications);
notificationRouter.post('/solicitude/friend/:userId/:friendID',isLogin, notificationController.solicitudeFriend);


module.exports = notificationRouter;