const notification = require("../models/Notifications");
const { Op } = require("sequelize");
const friend = require("../models/Friends");

//count the notifications
module.exports.countNotifications = async(userId) => {
    let noti = async () =>{

        const notificationV = await notification.findAll({where: { [Op.and]: [{ isRead: false }] }, include: { model: friend }})

        let Notifications = await notificationV.map(c => c.dataValues);
        let countFI = await Notifications.map(c => c.friend.dataValues);

        let cnl = (n, cfi) => {
            let count = 0;
            for (let i = 0; i < n.length; i++) {
                n[i].isRead == false && cfi[i].receptorID == userId ? count++ : count += 0;
            }
            return count;
        }

        return  cnl(Notifications, countFI);
    }


    return await noti();
}