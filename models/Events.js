const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Events = sequelize.define("event",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  title:{
      type: Sequelize.STRING,
      allowNull: false,
  },
  location:{
      type: Sequelize.STRING,
      allowNull: false,
  },
  date:{
        type: Sequelize.DATE,
        allowNull: false,
  },
})

module.exports = Events;