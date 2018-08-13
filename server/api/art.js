'use strict';
var Sequelize = require('sequelize');
const router = require('express').Router();
const { Art } = require('../../database/');

router.get('/', async (req, res, next) => {
  try {
    console.log('REACHED');
    const allArt = await Art.findAll();
    res.json(allArt);
  } catch (err) {
    next(err);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    const CreatedArt = Art.creare(req.body);
    if (CreatedArt) {
      res.status(201).json(CreatedArt);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
