const express = require('express');
const router = express.Router();
const userController = require('./../../controllers/users/');
const validateUser = require('../../middlewares/validateUserForSignup');
router
    .post('/users/signup', validateUser, userController.signUpUser)
    .post('/users/signIn', userController.signInUser)
    .get('/users/signOut', userController.signOutUser);
exports.router = router;
