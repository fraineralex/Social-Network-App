const express = require('express');
const friendController = require('../controllers/friendController');


const friendRouter = express.Router();

//friend home
friendRouter.get('/friend',friendController.getAllPublications);

//delete friend
friendRouter.get('/delete/friend/:userID/:friendID',friendController.deleteFriend);

//search friend
friendRouter.get('/searchNewFriendHome/:userID',friendController.searchNewFriendHome);
friendRouter.post('/searchNewFriend',friendController.searchNewFriend);

//solicitude friend
friendRouter.get('/solicitude/friend/:userID/:friendID',friendController.solicitudeFriend);

module.exports = friendRouter;