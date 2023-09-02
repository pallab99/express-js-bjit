const express = require('express');
const router = express.Router();
const userController = require('./../../controllers/users/');
const validateUser = require('../../middlewares/validateUserForSignup');
const validator = require('../../middlewares/validator');

router
    .post('/signup', validator.signUpUser, userController.signUpUser)
    .post('/signIn', userController.signInUser)
    .post('/verifyCode', userController.verifyCode)
    .post('/refreshToken', userController.refreshToken)
    .post('/logOut', userController.logOut);
exports.router = router;
