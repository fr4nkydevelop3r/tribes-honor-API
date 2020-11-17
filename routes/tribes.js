const express = require('express');
const router = express.Router();
const { requireSignin } = require('../controllers/auth');

const {
  getTribes,
  getTribe,
  addTribe,
} = require('../controllers/tribes');

router.get('/get-tribes', getTribes);
router.get('/get-tribe', getTribe);
//add validator
router.post('/add-tribe', requireSignin, addTribe);

module.exports = router;
