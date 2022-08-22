const Users = require("../models/Users");
const Friends = require("../models/friends");
const Events = require("../models/Events");
const EventRequests = require("../models/EventRequests");
const { Op } = require("sequelize");

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
          },
        ],
      })
        .then((result) => {
          let events;
          if (result.length > 0)
            events = result.map((result) => result.dataValues);

          res.render("client/events", {
            pageTitle: "Eventos",
            eventActive: true,
            user: user,
            events: events,
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

  Users.findOne({ where: {id: authorId}})
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
      })
        .then((result) => {
          const events = result.map((result) => result.dataValues);

          res.render("client/events", {
            pageTitle: "Eventos",
            eventActive: true,
            user: user,
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
};

exports.GetCreateEvent = (req, res, next) => {
  Users.findOne({ where: {id: req.user.id}})
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
        .then((result) => {
          const event = result.dataValues;
          res.render("client/add-invited", {
            pageTitle: "Agregar invitado",
            eventActive: true,
            user: user,
            event: event,
            viewInvited: viewInvited,
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

  Events.findOne({
    where: { id: eventId },
  })
    .then((result) => {
      const event = result.dataValues;

      Users.findOne({
        where: {
          id: authorId,
        },
      })
        .then((result) => {
          const user = result.dataValues;

          Users.findOne({
            where: {
              user: receptorUserName,
            },
          })
            .then((result) => {
              let receptorId;

              if (result) {
                receptorId = result.dataValues.id;
              }

              EventRequests.findOne({
                where: {
                  [Op.and]: [{ eventId: eventId }, { receptorId: receptorId }],
                },
              })
                .then((result) => {
                  if (result) {
                    return res.render("client/add-invited", {
                      pageTitle: "Agregar invitado",
                      eventActive: true,
                      user: user,
                      event: event,
                      alreadyInvited: true,
                    });
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
                    .then((result) => {
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
                            res.redirect('/view-invited/'+ authorId + '/' + eventId);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else {
                        res.render("client/add-invited", {
                          pageTitle: "Agregar invitado",
                          eventActive: true,
                          user: user,
                          event: event,
                          requestSended: true,
                        });
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
          console.log(result.length);

          if (result.length < 1) {
            return res.redirect("/events-created");
          }

          const invitedUsers = result.map((result) => result.dataValues);

          Events.findOne({
            where: { id: eventId },
          })
            .then((result) => {
              const event = result.dataValues;

              res.render("client/view-invited", {
                pageTitle: "Invitados",
                eventActive: true,
                user: user,
                event: event,
                invitedUsers: invitedUsers,
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
  if (message == "yes") contentMessage = "Asistiré";
  else if (message == "not") contentMessage = "No asistiré";
  else if (message == "maybe") contentMessage = "Tal vez asista";
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

exports.PostDeleteInvited = (req, res, next) => {
  const eventId = req.body.EventId;
  const receptorId = req.body.InvitedId;
  const authorId = req.body.AuthorId;
  console.log(eventId, receptorId, authorId)

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
                .then((result) => {
                  const user = result.dataValues;

                  res.render("client/test", {
                    pageTitle: "Invitados",
                    eventActive: true,
                    user: user,
                    event: event,
                    invitedUsers: invitedUsers,
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
