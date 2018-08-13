const Sequelize = require("sequelize");
const db = require("../db");

const Art = db.define("art", {
  artPiece: {
    type: Sequelize.JSONB,
    allowNull: false
  },
  location: {
    type: Sequelize.ARRAY(Sequelize.FLOAT),
    allowNull: false 
  },
  description: {
    type: Sequelize.STRING
  },
  likes: {
    type: Sequelize.INTEGER
  }
})

module.exports = Art