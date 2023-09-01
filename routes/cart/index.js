const express = require('express');
const Cart = require('../../controllers/cart');
const validateToken = require('../../middlewares/tokenValidator');
const addToCartValidation = require('../../middlewares/cartValidator');
const router = express.Router();

router
    .get('/all', validateToken, Cart.getAllCartItems)
    .get('/details/:userId', validateToken, Cart.getCartByUserId)
    .post('/create', validateToken, addToCartValidation, Cart.addToCart);

exports.router = router;
