const Users = require("../models/Users");
const Friends = require("../models/friends");
const Events = require("../models/Events");
const { Op } = require("sequelize");

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

exports.GetCreateEvent = (req, res, next) => {
  const userId = 2; // req.params.userId
  let userFriends;
  Friends.findAll({
    where: {
      [Op.or]: [{ senderID: userId }, { receptorID: userId }],
      [Op.and]: [{ isAccepted: 1 }],
    },
  })
    .then((fs) => {
      //mapping friends confirmation
      const senderID = fs.map((f) =>
        f.dataValues.senderID !== userId ? f.dataValues.senderID : 0
      );
      const receptorID = fs.map((f) =>
        f.dataValues.receptorID !== userId ? f.dataValues.receptorID : 0
      );
      return senderID.concat(receptorID);
    })
    .then((friends) => {
      userFriends = friends;
      Users.findOne()
        .then((result) => {
          let user;
          if (result) {
            user = result.dataValues;
          }

          res.render("client/create-event", {
            pageTitle: "Crear evento",
            eventActive: true,
            user: user,
            friends: userFriends,
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

exports.GetCreatedEvents = (req, res, next) => {
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
            createdMode: true,
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

exports.PostCreateEvent = (req, res, next) => {
  const name = req.body.Name;
  const place = req.body.Place;
  const date = req.body.Date;
  const authorId = req.body.AuthorId;

  Events.create({
    name: name,
    place: place,
    date: date,
    authorId: authorId,
  })
    .then(() => {
      res.redirect("/events-created");
    })
    .catch((err) => {
      console.log(err);
    });
};
