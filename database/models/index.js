const Art = require('./art')
const User = require('./user')
const db = require("../db");

//One to Many Association

Art.belongsTo(User)
User.hasMany(Art)

module.exports = {
  db,
  Art,
  User
}