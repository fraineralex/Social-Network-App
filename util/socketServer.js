const notification = require('../models/Notifications');
const friend = require('../models/Friends');
const {Op} = require('sequelize');


        
module.exports.socketS = (io)=>{

    io.on("connection",async socket => {

        
    });
}



// let getNumberOfAllNotifications = (ids) =>{
//     const userId = ids.userID;
    
//     notification.findAll({where: {[Op.and]:[{isRead: false}]},include: {model: friend},})
//     .then( async count=> {
//         let n = count.map(n => n.dataValues);
//         let c = n.map(c => c.friend.dataValues);

//         let cnl = (n, cfi) =>{
//             let count = 0;
//             for(let i = 0; i < n.length; i++){
//                 n[i].isRead == false && cfi[i].receptorID == userId ? count++ : count += 0;
//             }
//             return count;
//         }  

//         socket.emit("notificationNumber", await cnl(n, c));
//   }).catch((err) => console.log(err));

// }

// //get id user
// socket.on("userID", data => {
//     let userId = data
//     let userIdS = socket.id

//     if(array.find(i => i.userID ===  userId)){
//         console.log('\n\n\n\n\n\nexiste', array);
//         array.map(i =>{
//             if(i.userID === userId){
//                 i.userIdS = userIdS
//             }
//         });
//     }else{
//         console.log('\n\n\n\n\n\nno existe', array);
//         array.push({
//             "userID": userId, 
//             "userIdS": userIdS
//         })    
//     }

//     //send the id user
//     getNumberOfAllNotifications(array.find(i => {
//         if(i.userID === userId){
//             return [i.userIdS, i.userID]
//         }
//     }));
//     // getNotifications(userId);
// });