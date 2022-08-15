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

exports.GetCreatedEvents = (req, res, next) => {
  let authorId = 1;

  Users.findAll()
    .then((result) => {
      const users = result.map((result) => result.dataValues);
      Users.findOne()
        .then((result) => {
          let user;
          if (result) {
            user = result.dataValues;
          }
          Events.findAll({
            where: { authorId: authorId },
          })
            .then((result) => {
              const events = result.map((result) => result.dataValues);
              res.render("client/events", {
                pageTitle: "Eventos",
                eventActive: true,
                user: user,
                users: users,
                events: events,
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
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.GetCreateEvent = (req, res, next) => {
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

exports.PostDeleteEvent = (req, res, next) => {
  const eventId = req.body.EventId;

  Events.destroy({ where: { id: eventId } })
    .then(() => {
      return res.redirect("/events-created");
    })
    .catch((err) => {
      console.log(err);
    });
};
