const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Posts = sequelize.define("posts",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  src:{
    type: Sequelize.STRING,
    allowNull: true,
},
  content:{
      type: Sequelize.TEXT,
      allowNull: true,
  }
})

module.exports = Posts;