const express = require('express');
const router = express.Router();
const user = require('./../../controllers/users/');
const validateUser = require('../../middlewares/validateUserForSignup');
router
    .post('/users/signup', validateUser, user.signUpUser)
    .post('/users/signIn', user.signInUser)
    .get('/users/signOut', user.signOutUser);
exports.router = router;
