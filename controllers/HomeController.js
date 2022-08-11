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
      PostImages.findAll({
        include: [{ model: Users, as: "author" }, { model: Comments }],
      })
        .then((result) => {
          const postImages = result.map((result) => result.dataValues);
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
};

exports.GetNewPostImage = (req, res, next) => {
  Users.findOne({
    where: id = 1
  })
    .then((result) => {
      const user = result.dataValues;

      res.render("client/save-post", {
        pageTitle: "Home",
        homeActive: true,
        postImage: true,
        user: user
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.GetNewComment = (req, res, next) => {
  const comment = req.query.comment;
  const postId = req.params.PostId;

  if (comment === "post") {
    Posts.findOne({
      where: {
        id: postId,
      },
      include: [{ model: Users, as: "author" }, { model: Comments }],
    })
      .then((result) => {
        const post = result.dataValues;
        Users.findOne()
          .then((result) => {
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
  } else if (comment === "postImage") {
    PostImages.findOne({
      where: {
        id: postId,
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
              postImage: true,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    return res.redirect("/");
  }
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
  const postImageId = req.body.PostImageId;
  const authorId = req.body.AuthorId;

  if (!postId) {
    Comments.create({
      content: content,
      authorId: authorId,
      postImageId: postImageId,
    })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Comments.create({ content: content, authorId: authorId, postId: postId })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.GetNewReply = (req, res, next) => {
  const comment = req.query.comment;
  const commentId = req.params.CommentId;
  const postId = req.params.PostId;

  if (comment === "post") {
    Posts.findOne({
      where: {
        id: postId,
      },
      include: [{ model: Users, as: "author" }, { model: Comments }],
    })
      .then((result) => {
        const post = result.dataValues;
        Users.findOne()
          .then((result) => {
            const user = result.dataValues;

            res.render("client/home", {
              pageTitle: "Home",
              homeActive: true,
              post: post,
              user: user,
              search: true,
              comment: true,
              commentId: commentId,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (comment === "postImage") {
    PostImages.findOne({
      where: {
        id: postId,
      },
      include: [{ model: Users, as: "author" }, { model: Comments }],
    })
      .then((result) => {
        const post = result.dataValues;
        Users.findOne()
          .then((result) => {
            const user = result.dataValues;

            res.render("client/home", {
              pageTitle: "Home",
              homeActive: true,
              post: post,
              user: user,
              search: true,
              comment: true,
              postImage: true,
              commentId: commentId,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    return res.redirect("/");
  }
};

exports.PostNewReply = (req, res, next) => {
  const content = req.body.Content;
  const postId = req.body.PostId;
  const commentId = req.body.CommentId;
  const postImageId = req.body.PostImageId;
  const authorId = req.body.AuthorId;
  console.log(commentId);

  if (!postId) {
    Comments.create({
      content: content,
      authorId: authorId,
      postImageId: postImageId,
      commentId: commentId,
    })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Comments.create({
      content: content,
      authorId: authorId,
      postId: postId,
      commentId: commentId,
    })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
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

exports.GetEditPost = (req, res, next) => {
  const edit = req.query.edit;
  const postId = req.params.PostId;

  if (!edit) {
    res.redirect("/");
  }
  Posts.findOne({
    where: {
      id: postId
    },
    include: [{ model: Users, as: "author" }, { model: Comments }],
  })
    .then((result) => {
      const post = result.dataValues;
      Users.findOne({
        where: {
          id: 1,
        }
      })
        .then((result) => {
          const user = result.dataValues;

          res.render("client/save-post", {
            pageTitle: "Home",
            homeActive: true,
            post: post,
            user: user,
            editMode: true
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
