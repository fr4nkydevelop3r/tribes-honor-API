const express = require('express');
const router = express.Router();

const { getTribes } = require('../controllers/tribes');

router.get('/get-tribes', getTribes);

module.exports = router;
