const express = require('express');

const router = express.Router();

const homeController = require('../controllers/HomeController');

router.get("/",homeController.GetHome);
router.post("/new-post",homeController.PostNewPost);


module.exports = router;
