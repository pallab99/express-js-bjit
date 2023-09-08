const express = require('express');
const Cart = require('../../controllers/cart');
const validateToken = require('../../middlewares/tokenValidator');
const addToCartValidation = require('../../middlewares/cartValidator');
const transaction = require('../../controllers/transaction');
const router = express.Router();
// const passport = require('passport');
// const passportJWTAuth = passport.authenticate('jwt', { session: false });
router.post('/create', transaction.createTransaction);

exports.router = router;
