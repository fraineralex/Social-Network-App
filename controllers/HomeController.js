const Users = require("../models/Users");
const Post = require("../models/Posts");


exports.GetHome = (req, res, next) => {
    Users.findAll().then((result) => {

        const users = result.map((result) => result.dataValues);
  
        res.render("client/home", {
          pageTitle: "Home",
          homeActive: true,
          users: users,
          hasUsers: users.length > 0,
          search: true,
        })

    }).catch((err) => {
        console.log(err);
      });
  };

  exports.PostNewPost = (req, res, next) => {
    console.log(req.body);
    const authorId = req.body.AuthorId;
    const content = req.body.PostContent;
    Post.create({content: content, authorId: authorId}).then((result)=>{
        res.redirect("/");
    }).catch((err)=>{
        console.log(err);
    });

};

