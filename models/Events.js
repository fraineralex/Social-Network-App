const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Events = sequelize.define("event",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  name:{
      type: Sequelize.STRING,
      allowNull: false,
  },
  place:{
      type: Sequelize.STRING,
      allowNull: false,
  },
  date:{
        type: Sequelize.STRING,
        allowNull: false,
  },
})

module.exports = Events;