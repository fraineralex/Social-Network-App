const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Posts = sequelize.define("post",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  content:{
      type: Sequelize.TEXT,
      allowNull: false,
  },
})

module.exports = Posts;