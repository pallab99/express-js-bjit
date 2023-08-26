const express = require('express');
const router = express.Router();
const user = require('./../../controllers/users/');
router
    .post('/users/signup', user.signUpUser)
    .post('/users/signIn', user.signInUser)
    .get('/users/signOut', user.signOutUser);
exports.router = router;
