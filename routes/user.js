const express = require('express');
const router = express.Router();

//import controller
const {
  requireSignin,
  adminMiddleware,
} = require('../controllers/auth');
const { read, update, getUsers } = require('../controllers/user');

router.get('/user/:id', requireSignin, read);
router.put('/user/update', requireSignin, update);
router.put('/admin/update', requireSignin, adminMiddleware, update);
router.get('/get-users', getUsers);
module.exports = router;
