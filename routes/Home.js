const express = require('express');

const router = express.Router();

const homeController = require('../controllers/HomeController');

router.get("/",homeController.GetHome);
router.post("/new-post",homeController.PostNewPost);
router.get("/new-comment/:PostId",homeController.GetNewComment);
router.post("/new-comment",homeController.PostNewComment);
router.get("/new-reply/:PostId/:CommentId",homeController.GetNewReply);
router.post("/new-reply",homeController.PostNewReply);
router.get("/new-post-image",homeController.GetNewPostImage);
router.post("/new-post-image",homeController.PostNewPostImage);
router.get("/edit-post/:PostId",homeController.GetEditPost);


module.exports = router;
