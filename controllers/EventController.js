const Users = require("../models/Users");
const Friends = require("../models/friends");
const Events = require("../models/Events");
const EventRequests = require("../models/EventRequests");
const { Op } = require("sequelize");
const notiCount = require("../util/countNotifications");
const { asIs } = require("sequelize");
const moment = require("moment");

exports.GetAllEvents = (req, res, next) => {
  let currentlyUser = req.user.id;

  Users.findOne({
    where: {
      id: currentlyUser,
    },
  })
    .then((result) => {
      let user;
      if (result) {
        user = result.dataValues;
      }

      Events.findAll({
        include: [
          {
            model: EventRequests,
            where: {
              receptorId: currentlyUser,
            },
            order: [["createdAt", "DESC"]],
          },
        ],
      })
        .then(async (result) => {
          let events;
          if (result.length > 0)
            events = result.map((result) => result.dataValues);

          res.render("client/events", {
            pageTitle: "Eventos",
            eventActive: true,
            user: user,
            events: events,
            nCount1: await notiCount.countNotifications(currentlyUser),
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
  let authorId = req.user.id;

  Users.findOne({ where: { id: authorId } })
    .then((result) => {
      let user;
      if (result) {
        user = result.dataValues;
      }

      Events.findAll({
        where: {
          authorId: authorId,
        },
        include: [{ model: EventRequests }],
        order: [["createdAt", "DESC"]],
      })
        .then(async (result) => {
          const events = result.map((result) => result.dataValues);

          res.render("client/events", {
            pageTitle: "Eventos",
            eventActive: true,
            user: user,
            events: events,
            createdMode: true,
            nCount1: await notiCount.countNotifications(authorId),
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
  let userId = req.user.id;
  Users.findOne({ where: { id: userId } })
    .then(async (result) => {
      let user;
      if (result) {
        user = result.dataValues;
      }

      res.render("client/create-event", {
        pageTitle: "Crear evento",
        eventActive: true,
        user: user,
        dateTime: moment().format().slice(0, 16),
        nCount1: await notiCount.countNotifications(userId),
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

exports.GetDeleteEvent = (req, res, next) => {
  const eventId = req.params.EventId;
  console.log(eventId);

  Events.destroy({ where: { id: eventId } })
    .then(() => {
      return res.redirect("/events-created");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.GetAddInvited = (req, res, next) => {
  const authorId = req.user.id;
  const eventId = req.params.EventId;
  const viewInvited = req.query.viewInvited;

  Users.findOne({
    where: { id: authorId },
  })
    .then((result) => {
      let user;
      if (result) {
        user = result.dataValues;
      }
      Events.findOne({
        where: { id: eventId },
      })
        .then(async (result) => {
          const event = result.dataValues;
          res.render("client/add-invited", {
            pageTitle: "Agregar invitado",
            eventActive: true,
            user: user,
            event: event,
            viewInvited: viewInvited,
            nCount1: await notiCount.countNotifications(authorId),
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

exports.PostAddInvited = (req, res, next) => {
  const authorId = req.body.AuthorId;
  const eventId = req.body.EventId;
  const receptorUserName = req.body.ReceptorUserName;

  Users.findOne({
    where: {
      [Op.and]: [{user: receptorUserName}, {isActive: true}],
    },
  })
    .then((result) => {
      let receptorId = 0;

      if (result) {
        receptorId = result.dataValues.id;
      }

      EventRequests.findOne({
        where: {
          [Op.and]: [{ eventId: eventId }, { receptorId: receptorId }],
        },
      })
        .then(async (result) => {
          if (result) {
            req.flash("errors", "This user has been invited");
            return res.redirect("/add-invited/" + authorId + "/" + eventId);
          }

          Friends.findOne({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    { senderID: authorId },
                    { receptorID: receptorId },
                  ],
                },
                {
                  [Op.and]: [
                    { senderID: receptorId },
                    { receptorID: authorId },
                  ],
                },
              ],
            },
          })
            .then(async (result) => {
              let areFriend = false;

              if (result) {
                areFriend = result.dataValues.isAccepted;
              }

              if (areFriend) {
                EventRequests.create({
                  authorId: authorId,
                  receptorId: receptorId,
                  eventId: eventId,
                })
                  .then(() => {
                    res.redirect("/view-invited/" + authorId + "/" + eventId);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                req.flash(
                  "errors",
                  "This user could not be found in your friends list"
                );
                return res.redirect("/add-invited/" + authorId + "/" + eventId);
              }
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

exports.GetViewInvited = (req, res, next) => {
  const authorId = req.user.id;
  const eventId = req.params.EventId;

  Users.findOne({
    where: { id: authorId },
  })
    .then((result) => {
      const user = result.dataValues;

      Users.findAll({
        where: { [Op.not]: { id: authorId } },
        include: [
          {
            model: EventRequests,
            where: {
              eventId: eventId,
            },
          },
        ],
      })
        .then((result) => {
          if (result.length < 1) {
            req.flash("errors", "You haven't invited anyone to this event yet");
            return res.redirect("/events-created");
          }

          const invitedUsers = result.map((result) => result.dataValues);

          Events.findOne({
            where: { id: eventId },
          })
            .then(async (result) => {
              const event = result.dataValues;

              res.render("client/view-invited", {
                pageTitle: "Invitados",
                eventActive: true,
                user: user,
                event: event,
                invitedUsers: invitedUsers,
                nCount1: await notiCount.countNotifications(authorId),
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

exports.PostMessageReceptor = (req, res, next) => {
  const eventId = req.body.EventId;
  const receptorId = req.body.ReceptorId;
  const message = req.params.Message;

  let contentMessage;
  if (message == "yes") contentMessage = "I'll attend";
  else if (message == "maybe") contentMessage = "Maybe I'll attend";
  else if (message == "not") contentMessage = "I won't attend";
  else return res.redirect("/events");

  EventRequests.update(
    { message: contentMessage },
    {
      where: {
        [Op.and]: [{ eventId: eventId }, { receptorId: receptorId }],
      },
    }
  )
    .then(() => {
      res.redirect("/events");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.GetDeleteInvited = (req, res, next) => {
  const receptorId = req.params.InvitedId;
  const eventId = req.params.EventId;
  const authorId = req.params.AuthorId;

  EventRequests.destroy({
    where: {
      [Op.and]: [{ eventId: eventId }, { receptorId: receptorId }],
    },
  })
    .then(() => {
      Events.findOne({
        where: { id: eventId },
      })
        .then((result) => {
          const event = result.dataValues;
          Users.findAll({
            where: { [Op.not]: { id: authorId } },
            include: [
              {
                model: EventRequests,
                where: {
                  eventId: eventId,
                },
              },
            ],
          })
            .then((result) => {
              console.log(result.length);

              if (result.length < 1) {
                return res.redirect("/events-created");
              }

              const invitedUsers = result.map((result) => result.dataValues);

              Users.findOne({
                where: { id: authorId },
              })
                .then(async (result) => {
                  const user = result.dataValues;

                  res.render("client/test", {
                    pageTitle: "Invitados",
                    eventActive: true,
                    user: user,
                    event: event,
                    invitedUsers: invitedUsers,
                    nCount1: await notiCount.countNotifications(authorId),
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
