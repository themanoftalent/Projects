const express = require('express');
const driver = require('./driver');
const bus = require('./bus');
const operation = require('./operation');

const router = express.Router();


router.use('/driver', driver);
router.use('/bus', bus);
router.use('/operation', operation);

module.exports = router;