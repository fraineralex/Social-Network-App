const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const PostImages = sequelize.define("postImage",{
  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
  },
  src:{
    type: Sequelize.STRING,
    allowNull: false,
},
  caption:{
      type: Sequelize.TEXT,
      allowNull: true,
  }
})

module.exports = PostImages;