const express = require('express');
const friendController = require('../controllers/friendController');


const friendRouter = express.Router();

friendRouter.get('/friend',friendController.getAllPublications);


module.exports = friendRouter;