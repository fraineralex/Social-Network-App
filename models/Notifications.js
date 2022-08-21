const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Notifications = sequelize.define("notification",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  typeNotification:{
      type: Sequelize.STRING,
      allowNull: false,
  },
  isRead:{
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
})

module.exports = Notifications;