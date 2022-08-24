const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Users = sequelize.define("user",{
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
  lastName:{
      type: Sequelize.STRING,
      allowNull: false,
  },
  phone:{
    type: Sequelize.STRING,
    allowNull: false,
    },
    imageProfile:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    user:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    isActive:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    resetToken:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    resetTokenExpiration:{
        type: Sequelize.DATE,
        allowNull: true,
    },
})

module.exports = Users;