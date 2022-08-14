const Users = require("../models/Users");
const Comments = require("../models/Comments");
const Posts = require("../models/Posts");

exports.GetAllEvents = (req, res, next) => {
  Users.findAll()
    .then((result) => {
      const users = result.map((result) => result.dataValues);
      Users.findOne()
        .then((result) => {
          let user;
          if (result) {
            user = result.dataValues;
          }

          res.render("client/events", {
            pageTitle: "Eventos",
            eventActive: true,
            user: user,
            users: users,
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
