const post = require('../models/Posts');
const friend = require('../models/friends');
const user = require('../models/Users');
const {Op} = require('sequelize');

// get all friends post
module.exports.getAllPublications = (req, res, next) => {

    const userId = 2;// req.params.userId

    friend.findAll({where: {[Op.or]: [{senderID: userId},{receptorID: userId}],[Op.and]:[{isAccepted: 1}]}}).then(fs => { 

        //mapping friends confirmation 
        const senderID = fs.map(f=>f.dataValues.senderID !== userId ? f.dataValues.senderID :0);
        const receptorID = fs.map(f=>f.dataValues.receptorID !== userId ? f.dataValues.receptorID :0);        
        return senderID.concat(receptorID);

    }).then(friendS=>{
        //get all friends post
        post.findAll({include: {model: user, as: "author"}, where: {authorId: friendS}}).then((p)=>{

            //organize posts by the most recently 
            const postF = p.map(post =>post.dataValues);
            postF.sort((a,b)=>{
                if(new Date(a.createdAt).getSeconds() > new Date(b.createdAt).getSeconds()){return -1;}
                if(new Date(a.createdAt).getSeconds() > new Date(b.createdAt).getSeconds()){return 1;}
                else{return new Date(a.createdAt).getSeconds() - new Date(b.createdAt).getSeconds();}
            });
            return postF;

        })
        .then(p=>{
            res.render('client/friend',{
                pageTitle: 'Friend',
                postF: p
            });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

