'use strict';
var Sequelize = require('sequelize');
const router = require('express').Router();
const { Art } = require('../../database/');

router.post('/add', async (req, res, next) => {
  try {
    const CreatedArt = await Art.create(req.body);
    if (CreatedArt) {
      res.status(201).json(CreatedArt);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.get('/', async (req, res, next) => {
  try {
    console.log('REACHED');
    const allArt = await Art.findAll();
    res.json(allArt);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
