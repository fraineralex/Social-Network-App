//get all notifications
module.exports.getNotifications = (req, res, next) => {
    res.redirect(`/`);
}


//solicitation of friendship there is no here
module.exports.solicitudeFriend = (req, res, next) => {
    friend
      .create({
        isAccepted: false,
        senderID: req.params.userID,
        receptorID: req.params.friendID,
      })
      .then(() => res.redirect(`/searchNewFriendHome/${req.params.userID}`))
      .catch((err) => console.log(err));
  };
  