const express = require('express');
const Cart = require('../../controllers/cart');
const validateToken = require('../../middlewares/tokenValidator');
const addToCartValidation = require('../../middlewares/cartValidator');
const router = express.Router();
const passport = require('passport');
const passportJWTAuth = passport.authenticate('jwt', { session: false });
router
    .get('/all', passportJWTAuth, Cart.getAllCartItems)
    .get('/details/:userId', passportJWTAuth, Cart.getCartByUserId)
    .get('/userOrderDetails/:id', passportJWTAuth, Cart.getCartItemsById)

    .post('/create', passportJWTAuth, addToCartValidation, Cart.addToCart);

exports.router = router;
