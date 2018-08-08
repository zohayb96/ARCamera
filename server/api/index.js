const router = require('express').Router();
const session = require('express-session');
const express = require('express');
const path = require('path');
const morgan = require('morgan');

// Static middleware
router.use(express.static(path.join(__dirname, '..', 'public')));

// // For all GET requests that aren't to an API route,
// // we will send the index.html!
// router.get('/*', (req, res, next) => {
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

// Handle 404s
router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handling endware
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Internal server error');
});

module.exports = router;
