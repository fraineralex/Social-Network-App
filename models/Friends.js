const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Friends = sequelize.define("friends",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  isAccepted:{
  type: Sequelize.BOOLEAN,
  defaultValue: false,
  },
  senderID:{
      type: Sequelize.INTEGER,
      allowNull: false,
  },
  receptorID:{
      type: Sequelize.INTEGER,
      allowNull: false,
  }

})

module.exports = Friends;