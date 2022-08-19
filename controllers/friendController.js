const post = require("../models/Posts");
const friend = require("../models/friends");
const user = require("../models/Users");
const { Op } = require("sequelize");

// get all friends post
module.exports.getAllPublications = (req, res, next) => {
  const userId = req.user.id; // req.params.userId
  let userFriends;

  friend
    .findAll({where: {[Op.or]: [{ senderID: userId }, { receptorID: userId }],[Op.and]: [{ isAccepted: 1 }]}}).then((fs) => {
      //mapping friends confirmation
      const senderID = fs.map((f) =>f.dataValues.senderID !== userId ? f.dataValues.senderID : 0);
      const receptorID = fs.map((f) =>f.dataValues.receptorID !== userId ? f.dataValues.receptorID : 0);
      return senderID.concat(receptorID);

    }).then((friendS) => {
      //get all friends post
      post.findAll({include: { model: user, as: "author" },where: { authorId: friendS },}).then((p) => {

          userFriends = friendS;
          //organize posts by the most recently
          const postF = p.map((post) => post.dataValues);
          postF.sort((a, b) => {
            if (new Date(a.createdAt).getSeconds() >new Date(b.createdAt).getSeconds()) {return -1;}
            if (new Date(a.createdAt).getSeconds() >new Date(b.createdAt).getSeconds()) {return 1;} 
            else {return (new Date(a.createdAt).getSeconds() -new Date(b.createdAt).getSeconds());}

          });
          return postF;
        })
        .then((p) => {
          //get all friends
          userFriends = userFriends.filter((f) => f !== 0);
          user.findAll({ where: { id: userFriends } }).then((f) => {
              const userF = f.map((uf) => uf.dataValues);
              user.findOne({ where: { id: userId } }).then((f) => {
                  
                  const imgConfirmation = p.map(cf=> cf.src !== null ? true : false);
                  const currentlyUser = f.dataValues;

                  res.render("client/friend", {
                    pageTitle: "Friend",
                    postF: p,
                    imgConfirmation,
                    userF,
                    userId,
                    user: currentlyUser
                  });

                }).catch((err) => console.log(err));
            }).catch((err) => console.log(err));
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
};

// delete friend
module.exports.deleteFriend = (req, res, next) => {
  const userID = req.user.id;
  const friendID = req.params.friendID;

  friend
    .findOne({
      where: {
        [Op.or]: [
          { [Op.and]: [{ senderID: userID }, { receptorID: friendID }] },
          { [Op.and]: [{ senderID: friendID }, { receptorID: userID }] },
        ],
      },
    })
    .then((f) => {
      friend.destroy({ where: { id: f.dataValues.id } }).then(() => res.redirect("/friend")).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
};

// search friend
module.exports.searchNewFriendHome = (req, res, next) => {
  res.render("client/addNewFriendHome", {
    pageTitle: "Search new Friend",
    userId: req.user.id,
  });
};
module.exports.searchNewFriend = (req, res, next) => {
  const userId = req.body.userId;
  
  //user
  user.findAll({where: {
        [Op.or]: [
          { name: { [Op.like]: req.body.userName } },
          { user: { [Op.like]: req.body.userName } },
          { lastName: { [Op.like]: req.body.userName } },
        ],
      },
    })
    .then((nf) => nf.map((nf) => nf.dataValues))
    .then((nf) => nf.filter((nf) => nf.id != userId))

    //friends
    .then((us) => {
      const userF = us.map((uf) => uf.id);
      const userFriends = us;
      friend.findAll({
          where: {
            [Op.or]: [
              { [Op.and]: [{ senderID: userId }, { receptorID: userF }] },
              { [Op.and]: [{ senderID: userF }, { receptorID: userId }] },
            ],
          },
        })
        .then((f) => f.map((fr) => fr.dataValues.isAccepted))
        .then((ac) => {
          res.render("client/addNewFriendHome", {
            pageTitle: "Search new Friend",
            userId: userId,
            ac,
            us: userFriends,
          });
        });
    }).catch((err) => console.log(err));
};