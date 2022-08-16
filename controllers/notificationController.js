const friend = require("../models/Friends");
const {Op} = require("sequelize");
//get all notifications
module.exports.getNotifications = (req, res, next) => {
    res.redirect(`/`);
}


//solicitation of friendship there is no here
module.exports.solicitudeFriend = (req, res, next) => {

  friend.findAll({where: {
      [Op.or]: [
        { [Op.and]: [{ senderID: req.params.userId }, { receptorID: req.params.friendID }] },
        { [Op.and]: [{ senderID: req.params.friendID }, { receptorID: req.params.userId }] },
      ]
    }}).then(fc=>{

      if(fc.length > 0){
        res.redirect(`/searchNewFriendHome/${req.params.userId}`);/*we need to checking that later*/
      }else{
        friend.create({
          isAccepted: false,
          senderID: req.params.userId,
          receptorID: req.params.friendID,
        }).then(() => res.redirect(`/searchNewFriendHome/${req.params.userId}`)).catch((err) => console.log(err));
      }

    }).catch((err) => console.log(err)); 
};
  