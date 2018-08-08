'use strict';

const chalk = require('chalk');
const Sequelize = require('sequelize');
const pkg = require('../package');

console.log(chalk.yellow('Opening database connection'));

// create the database instance that can be used in other database files
const db = new Sequelize(`postgres://localhost:5432/graffitiAR`, {
  logging: false, // so we don't see all the SQL queries getting made
});

module.exports = db;
