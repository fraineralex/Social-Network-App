const moment = require("moment");
moment.locale('es-do')

exports.FindName = (commentId, users) => {
  const user = users.find((user) => user.id == commentId);
  return user.name;
};

exports.GetDate = (date) => {
  date.toString().slice(0, -5)
  const time = moment(date, "YYYYMMDD, h:mm:ss").startOf('second').fromNow().replace('h', 'H')
  return time;
};

exports.FindImageProfile = (commentId, users) => {
  const user = users.find((user) => user.id == commentId);
  return user.imageProfile;
};

exports.FindReply = (commentId, comments) => {
  console.log(commentId, comments)
  const reply = comments.find((comment) => comment.commentId == commentId);
  return comments
};
