module.exports.RelationShips = ()=>{
    
    const Users = require("../models/Users");
    const Posts = require("../models/Posts");
    const PostImages = require("../models/PostImages");
    const Events = require("../models/Events");
    const Comments = require("../models/Comments");
    const Notifications = require("../models/Notifications");
    const Friends = require("../models/Friends");
    const EventRequests = require("../models/EventRequests");

    //User relationships

    Posts.belongsTo(Users, { constraint: true, onDelete: "CASCADE", as: 'author'},);
    Users.hasMany(Posts, {foreignKey: 'authorId'});

    PostImages.belongsTo(Users, { constraint: true, onDelete: "CASCADE", as: 'author'},);
    Users.hasMany(PostImages, {foreignKey: 'authorId'});

    Comments.belongsTo(Users, { constraint: true, onDelete: "CASCADE", as: 'author'},);
    Users.hasMany(Comments, {foreignKey: 'authorId'});

    Events.belongsTo(Users, { constraint: true, onDelete: "CASCADE", as: 'author'},);
    Users.hasMany(Events, {foreignKey: 'authorId'});

    Notifications.belongsTo(Users, { constraint: true, onDelete: "CASCADE", as: 'author'},);
    Users.hasMany(Notifications, {foreignKey: 'authorId'});

    /*
    Users.hasMany(Friends, {foreignKey: 'senderId'});
    Friends.belongsTo(Users, { constraint: true, onDelete: "CASCADE", as: 'sender'},);
    Friends.belongsTo(Users, { constraint: true, onDelete: "CASCADE", as: 'receptor'},);
    Users.hasMany(Friends, {foreignKey: 'receptorId'});
    */

    EventRequests.belongsTo(Users, { constraint: true, onDelete: "CASCADE", as: 'author'},);
    Users.hasMany(EventRequests, {foreignKey: 'authorId'});
    EventRequests.belongsTo(Users, { constraint: true, onDelete: "CASCADE", as: 'receptor'},);
    Users.hasMany(EventRequests, {foreignKey: 'receptorId'});

    // Post relationships
    Comments.belongsTo(Posts, { constraint: true, onDelete: "CASCADE", as: 'post'},);
    Posts.hasMany(Comments, {foreignKey: 'postId'});

    // PostImage relationships
    Comments.belongsTo(PostImages, { constraint: true, onDelete: "CASCADE", as: 'postImage'},);
    PostImages.hasMany(Comments, {foreignKey: 'postImageId'});

    // comment relationships
    Comments.belongsTo(Comments, { constraint: true, onDelete: "CASCADE", as: 'comment'},);
    Comments.hasMany(Comments, {foreignKey: 'commentId'});

    // event relationships
    EventRequests.belongsTo(Events, { constraint: true, onDelete: "CASCADE", as: 'event'},);
    Events.hasMany(EventRequests, {foreignKey: 'eventId'});

    // notifications relationships
    Notifications.belongsTo(Comments, { constraint: true, onDelete: "CASCADE", as: 'comment'},);
    Comments.hasOne(Notifications, {foreignKey: 'commentId'});

    Notifications.belongsTo(EventRequests, { constraint: true, onDelete: "CASCADE", as: 'event'},);
    EventRequests.hasMany(Notifications, {foreignKey: 'eventId'});

    Notifications.belongsTo(Friends, { constraint: true, onDelete: "CASCADE", as: 'friend'},);
    Friends.hasOne(Notifications, {foreignKey: 'friendId'});
}

