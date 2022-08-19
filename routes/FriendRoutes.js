const express = require('express');
const friendController = require('../controllers/friendController');
const isLogin = require("../middleware/is-login");


const friendRouter = express.Router();

//friend home
friendRouter.get('/friend',isLogin, friendController.getAllPublications);

//delete friend
friendRouter.get('/delete/friend/:userID/:friendID',isLogin, friendController.deleteFriend);

//search friend
friendRouter.get('/searchNewFriendHome/:userID',isLogin, friendController.searchNewFriendHome);
friendRouter.post('/searchNewFriend',isLogin, friendController.searchNewFriend);

module.exports = friendRouter;