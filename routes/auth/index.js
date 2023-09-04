const express = require('express');
const router = express.Router();
const AuthController = require('./../../controllers/auth');
const validator = require('../../middlewares/validator');

router
    .post('/login', AuthController.login)
    .post('/sign-up', validator.signUpUser, AuthController.signUp);

exports.router = router;
