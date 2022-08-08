const Users = require("../models/Users");
const Posts = require("../models/Posts");
const Comments = require("../models/Comments");
const PostImages = require("../models/PostImages");

exports.GetHome = (req, res, next) => {
  Posts.findAll({
    include: [{ model: Users, as: "author" }, { model: Comments }],
  })
    .then((result) => {
      const posts = result.map((result) => result.dataValues);
      PostImages.findAll({ include: [{ model: Users, as: "author" }] })
        .then((result) => {
          const postImages = result.map((result) => result.dataValues);
          Comments.findAll({
            include: [
              { model: Posts, as: "post" },
              /*               { model: PostImages, as: "postImage" }, */
              { model: Users, as: "author" },
            ],
          })
            .then((result) => {
              const comments = result.map((result) => result.dataValues);
              const lastComment = comments[0];
              Users.findAll()
                .then((result) => {
                  const users = result.map((result) => result.dataValues);
                  Users.findOne().then((result) => {
                    const user = result.dataValues;
                    res.render("client/home", {
                      pageTitle: "Home",
                      homeActive: true,
                      posts: posts,
                      user: user,
                      users: users,
                      postImages: postImages,
                      lastComment: lastComment,
                      hasComment: comments.length > 0,
                      hasPost: posts.length > 0,
                      search: true,
                    });
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.GetNewPostImage = (req, res, next) => {
  Users.findAll()
    .then((result) => {
      const users = result.map((result) => result.dataValues);

      res.render("client/home", {
        pageTitle: "Home",
        homeActive: true,
        users: users,
        hasUsers: users.length > 0,
        search: true,
        postImage: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.GetNewComment = (req, res, next) => {
  const comment = req.query.comment;
  const id = req.params.CommentId;

  if (!comment) {
    return res.redirect("/");
  }

  Posts.findOne({
    where: {
      id: id,
    },
    include: [{ model: Users, as: "author" }, { model: Comments }],
  })
    .then((result) => {
      const post = result.dataValues;
      Users.findOne()
        .then((result) => {
          console.log(result);
          const user = result.dataValues;


          res.render("client/home", {
            pageTitle: "Home",
            homeActive: true,
            post: post,
            user: user,
            search: true,
            comment: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.PostNewPost = (req, res, next) => {
  const authorId = req.body.AuthorId;
  const content = req.body.Content;
  Posts.create({ content: content, authorId: authorId })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.PostNewComment = (req, res, next) => {
  const content = req.body.Content;
  const postId = req.body.PostId;
  const authorId = req.body.AuthorId;
  Comments.create({ content: content, authorId: authorId, postId: postId })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.PostNewReply = (req, res, next) => {
  const content = req.body.Content;
  const postId = req.body.PostId;
  const authorId = req.body.AuthorId;
  const commentId = req.body.CommentId;
  Comments.create({
    content: content,
    authorId: authorId,
    postId: postId,
    commentId: commentId,
  })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.PostNewPostImage = (req, res, next) => {
  const authorId = req.body.AuthorId;
  const imageUrl = req.file;
  const caption = req.body.Caption;
  PostImages.create({
    src: "/" + imageUrl.path,
    authorId: authorId,
    caption: caption,
  })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
