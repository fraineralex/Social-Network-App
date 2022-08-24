const friend = require("../models/Friends");
const notification = require("../models/Notifications");
const user = require("../models/Users");
const { Op, Sequelize, and } = require("sequelize");
const webPush = require('../util/webPush');
const fs = require('fs');
const path = require('path');
const notiCount = require("../util/countNotifications");

//get all notifications
module.exports.getAllNotifications = async (req, res, next) => {

    let userId = req.user.id;

    user.findOne({ where: { id: userId } }).then((f) => {
      const currentlyUser = f.dataValues;

      friend.findAll({
        where: {
          [Op.or]: [
            { [Op.and]: [{ receptorID: userId }, {isAccepted: false}]},
          ]
        },
        order: [["createdAt", "DESC"]]
      }).then((fs) => {
        const friendS= fs.map(f => f.dataValues);
        const usersIdSender = friendS.map(f => f.senderID);

        user.findAll({where: {[Op.or]:[{id: usersIdSender}]}}).then(async (us)=>{
          const userS = us.map(u => u.dataValues);
          
          res.render("./client/Notification", {
            pageTitle: "Friend",
            user: currentlyUser,
            friendS,
            userS,
            nCount1: await notiCount.countNotifications(userId),
            ceroNotifications: await notiCount.countNotifications(userId) == 0 ? true : false,
          });
          
        }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
  }).catch((err) => console.log(err));
}



//friendShip solicitations
module.exports.solicitudeFriend = (req, res, next) => {

  let userId = req.params.userId;
  let friendID = req.params.friendID;
  let friendRequestId = req.params.friendRequestId;
  let typeNotificationV = 'Friend Request';
  let isReadV = false;

  friend.findOne({ where: { id: friendRequestId } }).then((f) => {
    notification.create({typeNotification: typeNotificationV, isRead: isReadV, friendId: friendRequestId}).then(() => {
      user.findOne({where: {id: userId}}).then( async (f)=>{
        let friendInfo = f.dataValues;

        //send the notification to the user
        try {
          let endpoint = await JSON.parse(fs.readFileSync(path.join(__dirname, "../endpoint.json"), 'utf8'));
          let container = await endpoint.filter(sub => sub.userId === `${friendID}`);
          pushSubscription = await container[0].subscriptions;
          const userNotification = await JSON.stringify({
            title: "Friend Request",
            body: `${friendInfo.user} has sent you a friend request`,
            icon: `${friendInfo.imageProfile}`,
          });
          
          await webPush.sendNotification(pushSubscription, userNotification);
          res.status(200).redirect(`/searchNewFriendHome/${userId}}`);
        } catch (error) {
          console.log('\nerror in web push notification: \n\n\n',error);
        }

      }).catch((err) => console.log(err));    
    }).catch(err => console.log(err));
  }).catch((err) => console.log(err));

}


//accept friend request
module.exports.acceptFriend = async (req, res, next) => {
  let id = req.params.idNotification;
  const updateSolicitude = await friend.update({isAccepted: true}, {where: {id: id}})
  const deleteNotification = await notification.destroy({where: {friendId: id}})
  res.status(200).redirect(`/Notifications`);
}

//delete Notification
module.exports.deleteNotification =  (req, res, next) => {
  let id = req.params.idNotification;
  notification.findOne({where: {friendId: id}}).then(async (n)=>{

    const idN = n.dataValues.id;
    const deleteNotification = await notification.destroy({where: {id: idN}})
    const deleteFriendSolicitations = await friend.destroy({where: {id: id}})
    res.status(200).redirect(`/Notifications`);
    
  }).catch((err) => console.log(err));
}

//view notification
module.exports.viewNotifications = async (req, res, next) => {
  const id = req.params.idNotification;
  const viewNotification = await notification.update({isRead: true}, {where: {friendId: id}})
  res.status(200).redirect(`/Notifications`);
}

//move this for loggin route and controller
module.exports.getNotifications =  async (req, res, next) => {
 
  let endpoint = JSON.parse(fs.readFileSync(path.join(__dirname, "../endpoint.json"), 'utf8'));
  
  if (endpoint.find(x => x.userId === req.body.userId)) {
    let endpointSave = endpoint.filter(x => x.userId != req.body.userId);
    let concatenated = endpointSave.concat(req.body);
    fs.writeFileSync(path.join(__dirname, "../endpoint.json"), JSON.stringify(concatenated, null, 2));
    console.log("subscription updated");

  } else {//add the subscription to the json file
    endpoint.push(req.body);
    fs.writeFileSync(path.join(__dirname, "../endpoint.json"), JSON.stringify(endpoint, null, 2));
    console.log("subscription added");
  }

  res.status(200).json();
}
