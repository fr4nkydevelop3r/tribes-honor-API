const express = require('express');
const router = express.Router();

const { getTribes, getTribe } = require('../controllers/tribes');

router.get('/get-tribes', getTribes);
router.get('/get-tribe', getTribe);

module.exports = router;
