exports.NotificationInfoName = (user, iterator) => user[iterator].name;
exports.NotificationInfoUserName = (user, iterator) => user[iterator].user;
exports.NotificationInfoImg = (user, iterator) => user[iterator].imageProfile;
exports.NotificationCount = (num) => num === 0 || num === null || num === '0';
