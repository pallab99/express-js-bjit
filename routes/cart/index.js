const express = require('express');
const Cart = require('../../controllers/cart');
const validateToken = require('../../middlewares/tokenValidator');
const router = express.Router();
// const orderController = require('../../controllers/orders');
// const validateToken = require('../../middlewares/tokenValidator');

router
    .get('/all', validateToken, Cart.getAllCartItems)
    .post('/create', validateToken, Cart.addToCart);

exports.router = router;
