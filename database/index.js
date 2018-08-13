const Art = require('./models/art');
const User = require('./models/user');
const db = require('./database');

//One to Many Association

Art.belongsTo(User);
User.hasMany(Art);

module.exports = {
  db,
  Art,
  User,
};
