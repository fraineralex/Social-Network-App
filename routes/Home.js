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
router.get("/edit-post/:PostId",homeController.GetEditPost);
router.post("/edit-post",homeController.PostEditPost);
router.post("/delete-post",homeController.PostDeletePost);


module.exports = router;
