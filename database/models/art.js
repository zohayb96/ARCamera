const Sequelize = require('sequelize');
const db = require('../database');

const Art = db.define('art', {
  artPiece: {
    type: Sequelize.JSONB,
    allowNull: false,
  },
  location: {
    type: Sequelize.ARRAY(Sequelize.DECIMAL),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  likes: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Art;
