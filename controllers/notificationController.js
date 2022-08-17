const friend = require("../models/Friends");
const {Op} = require("sequelize");
const webPush = require('../util/webPush');

let pushSubscription;

//get all notifications
module.exports.getNotifications = async (req, res, next) => {
  pushSubscription = req.body;
  console.log('\n',req.body);
  res.status(200).json();
}

//mu5AWWhl_7BezDq9k382uA
//friendShip solicitations
module.exports.solicitudeFriend = async(req, res, next) => {

  let userId = req.params.userId;
  let friendID = req.params.friendID;

  //this is so that the user cannot make more than one friend request  
  friend.findAll({where: {
      [Op.or]: [
        { [Op.and]: [{ senderID: userId }, { receptorID: friendID}] },
        { [Op.and]: [{ senderID: friendID }, { receptorID: userId }] },
      ]
    }}).then(fc=>{
      if(fc.length > 0){
        res.redirect(`/searchNewFriendHome/${req.params.userId}`);/*we need to checking that later*/
      }else{
        //create a new friend request
        friend.create({
          isAccepted: false,
          senderID: userId,
          receptorID: friendID,
        }).then(() => res.redirect(`/searchNewFriendHome/${req.params.userId}`)).catch((err) => console.log(err));
      }
    }).catch((err) => console.log(err));
    
    const userNotification = JSON.stringify({
      title: 'Friendship Request',
      body: 'You have a new friendship request',
      icon: 'https://cdn.pixabay.com/photo/2016/12/08/15/03/dog-1915266_960_720.png',
    });

  await webPush.sendNotification(pushSubscription, userNotification);
};
  