const Users = require("../models/Users");
const Comments = require("../models/Comments");
const Posts = require("../models/Posts");
const notiCount = require("../util/countNotifications");

exports.GetHome = (req, res, next) => {
  Posts.findAll({
    include: [
      { model: Users, as: "author", where: { id: req.user.id } },
      { model: Comments,
        order: [["createdAt", "DESC"]]
        },
    ],
    order: [["createdAt", "DESC"]],
  })
    .then((result) => {
      const posts = result.map((result) => result.dataValues);
      Users.findAll()
        .then((result) => {
          const users = result.map((result) => result.dataValues);
          let userIdn = req.user.id 
          Users.findOne({ where: { id: userIdn} })
            .then(async (result) => {
              let user;
              if (result) {
                user = result.dataValues;
              }

              res.render("client/home", {
                pageTitle: "Home",
                homeActive: true,
                posts: posts,
                user: user,
                users: users,
                hasPost: posts.length > 0,
                nCount1: await notiCount.countNotifications(userIdn),
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

exports.GetNewPost = (req, res, next) => {
  let userIdn = req.user.id
  Users.findOne({ where: { id: req.user.id } })
    .then( async  (result) => {
      const user = result.dataValues;

      res.render("client/save-post", {
        pageTitle: "Home",
        homeActive: true,
        post: { src: true },
        user: user,
        nCount1: await notiCount.countNotifications(userIdn),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.GetNewComment = (req, res, next) => {
  const postId = req.params.PostId;

  Posts.findOne({
    where: {
      id: postId,
    },
    include: [{ model: Users, as: "author" }, { model: Comments }],
  })
    .then((result) => {
      const post = result.dataValues;
      Users.findOne({ where: { id: req.user.id } })
        .then((result) => {
          const user = result.dataValues;
          Users.findAll()
            .then(async  (result) => {
              const users = result.map((result) => result.dataValues);

              res.render("client/add-comments", {
                pageTitle: "Home",
                homeActive: true,
                post: post,
                user: user,
                users: users,
                nCount1: await notiCount.countNotifications(postId),
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

exports.PostNewComment = (req, res, next) => {
  const content = req.body.Content;
  const postId = req.body.PostId;
  const authorId = req.body.AuthorId;

  Comments.create({
    content: content,
    authorId: authorId,
    postId: postId,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.GetNewReply = (req, res, next) => {
  const postId = req.params.PostId;
  const commentId = req.params.CommentId;

  Posts.findOne({
    where: {
      id: postId,
    },
    include: [{ model: Users, as: "author" }, { model: Comments }],
  })
    .then((result) => {
      const post = result.dataValues;
      Users.findOne({ where: { id: req.user.id } })
        .then((result) => {
          const user = result.dataValues;
          const authorId = user.id;
          Users.findAll()
            .then(async  (result) => {
              const users = result.map((result) => result.dataValues);

              res.render("client/add-comments", {
                pageTitle: "Home",
                homeActive: true,
                post: post,
                user: user,
                users: users,
                commentId: commentId,
                nCount1:await notiCount.countNotifications(authorId),
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

exports.PostNewReply = (req, res, next) => {
  const content = req.body.Content;
  const postId = req.body.PostId;
  const commentId = req.body.CommentId;
  const authorId = req.body.AuthorId;

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
};

exports.PostNewPost = (req, res, next) => {
  const authorId = req.body.AuthorId;
  const imageUrl = req.file;
  const content = req.body.Content;

  if (imageUrl) {
    Posts.create({
      src: "/" + imageUrl.path,
      authorId: authorId,
      content: content,
    })
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Posts.create({
      authorId: authorId,
      content: content,
    })
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.GetEditPost = (req, res, next) => {
  const edit = req.query.edit;
  const postId = req.params.PostId;

  if (!edit) {
    res.redirect("/");
  }
  Posts.findOne({
    where: {
      id: postId,
    },
    include: [{ model: Users, as: "author" }, { model: Comments }],
  })
    .then((result) => {
      const post = result.dataValues;
      let userIdn = req.user.id
      Users.findOne({ where: { id: req.user.id } })
        .then(async  (result) => {
          const user = result.dataValues;

          res.render("client/save-post", {
            pageTitle: "Home",
            homeActive: true,
            post: post,
            user: user,
            editMode: true,
            nCount1: await notiCount.countNotifications(userIdn),
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

exports.PostEditPost = (req, res, next) => {
  const postId = req.body.PostId;
  const imageUrl = req.file;
  const content = req.body.Content;

  if (imageUrl) {
    Posts.update(
      {
        src: "/" + imageUrl.path,
        content: content,
      },
      { where: { id: postId } }
    )
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Posts.update(
      {
        content: content,
      },
      { where: { id: postId } }
    )
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.PostDeletePost = (req, res, next) => {
  const postId = req.body.PostId;

  Posts.destroy({ where: { id: postId } })
    .then((result) => {
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.PostDeleteComment = (req, res, next) => {
  const commentId = req.body.CommentId;

  Comments.destroy({ where: { id: commentId } })
    .then((result) => {
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
