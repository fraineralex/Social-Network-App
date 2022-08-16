const express = require('express');
const notificationController = require('../controllers/notificationController');


const notificationRouter = express.Router();

notificationRouter.get('/solicitude/friend/:userId/:friendID', notificationController.solicitudeFriend);



module.exports = notificationRouter;