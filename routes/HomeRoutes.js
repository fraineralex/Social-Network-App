const express = require('express');

const router = express.Router();

const homeController = require('../controllers/HomeController');
const isLogin = require("../middleware/is-login");

router.get("/",isLogin, homeController.GetHome);
router.post("/new-post",isLogin, homeController.PostNewPost);
router.get("/delete-post/:PostId",isLogin, homeController.GetDeletePost);
router.get("/new-comment/:PostId",isLogin, homeController.GetNewComment);
router.post("/new-comment",isLogin, homeController.PostNewComment);
router.get("/new-reply/:PostId/:CommentId",isLogin, homeController.GetNewReply);
router.post("/new-reply",isLogin, homeController.PostNewReply);
router.get("/new-post-image",isLogin, homeController.GetNewPost);
router.get("/edit-post/:PostId",isLogin, homeController.GetEditPost);
router.post("/edit-post",isLogin, homeController.PostEditPost);


module.exports = router;
