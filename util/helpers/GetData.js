const moment = require("moment");
moment.locale("es-do");

exports.FindUser = (authorId, users) => {
  const user = users.find((user) => user.id == authorId);
  return user.user;
};

exports.GetDate = (date) => {
  date.toString().slice(0, -5);
  const time = moment(date, "YYYYMMDD, h:mm:ss")
    .startOf("second")
    .fromNow()
    .replace("h", "H");
  return time;
};

exports.GetEventDate = (date) => {
  const time = moment(date).format("LLLL");

  if (Date.parse(date) < Date.parse(moment().toDate())) {
    return false;
  } else {
    return time.charAt(0).toUpperCase() + time.slice(1);
  }
};

exports.FindImageProfile = (authorId, users) => {
  const user = users.find((user) => user.id == authorId);
  return user.imageProfile;
};

exports.FindCommentsWithoutReplies = (comments) => {
  const commentsWithoutReplies = comments.filter(
    (comment) => comment.dataValues.commentId == null
  );
  return commentsWithoutReplies;
};

exports.FindReply = (commentId, comments) => {
  const reply = comments.filter(
    (comment) => comment.dataValues.commentId == commentId
  );
  return reply;
};

exports.LengthValue = (array) => {
  if (array.length > 1) return "   " + array.length + " personas";
  else if (array.length == 1) return "   " + array.length + " persona";
  else return false;
};

exports.FindAnswer = (eventRequests, currentlyUser, btnAnswer) => {
  console.log(btnAnswer);
  const row = eventRequests.find(
    (result) => result.dataValues.receptorId === currentlyUser
  );
  if (row) {
    if (btnAnswer == "yes") {
      if (row.dataValues.message == "Asistiré") return "btn-primary";
      else return "btn-light";
    } else if (btnAnswer == "not") {
      if (row.message == "No asistiré") return "btn-primary";
      else return "btn-light";
    } else if (btnAnswer == "maybe") {
      if (row.message == "Tal vez asista") return "btn-primary";
      else return "btn-light";
    } else {
      return "btn-light";
    }
  } else {
    return "btn-light";
  }
};

exports.FindOneCommentWithoutReplies = (comments) => {
  const commentsWithoutReplies = comments.filter(
    (comment) => comment.dataValues.commentId == null
  );
  const comment = [commentsWithoutReplies[0]];
  return comment;
};

exports.FindOneReply =(commentId, comments) => {
  const reply = comments.filter(
    (comment) => comment.dataValues.commentId == commentId
  );
  const comment = [reply[0]];
  return comment;
};

exports.IsEqual =(userId, authorId) => {
  if(userId === authorId) return true;
  else return false;
};
