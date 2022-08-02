const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const EventRequests = sequelize.define("eventRequest",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  message:{
      type: Sequelize.STRING,
      allowNull: false,
  },
})

module.exports = EventRequests;