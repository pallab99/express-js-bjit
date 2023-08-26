const express = require('express');
const router = express.Router();
const user = require('./../../controllers/users/');
router.post('/users/signup', user.signUpUser);

exports.router = router;
