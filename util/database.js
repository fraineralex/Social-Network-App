const Sequelize = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("sqlite::memory:", {
  dialect: "sqlite",
  logging: false,
  storage: path.join(
    path.dirname(require.main.filename),
    "context",
    "socialNetwork.sqlite"
  ),
});


module.exports = sequelize;