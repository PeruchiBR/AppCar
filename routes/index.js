'use strict';

var express = require('express');
var router = express.Router();
var data = [];

router.get('/', function (req, res) {
  res.json(data);
});

router.post('/', function (req, res) {
  data.push({
    image: req.body.image,
    model: req.body.model,
    year: req.body.year,
    plate: req.body.plate,
    color: req.body.color
  });
  res.json({ message: 'success' });
});

module.exports = router;
