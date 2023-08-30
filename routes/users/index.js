const express = require('express');
const router = express.Router();
const userController = require('./../../controllers/users/');
const validateUser = require('../../middlewares/validateUserForSignup');
router
    .post('/signup', validateUser, userController.signUpUser)
    .post('/signIn', userController.signInUser)
    .post('/verifyCode', userController.verifyCode)
    .get('/signOut', userController.signOutUser);
exports.router = router;
