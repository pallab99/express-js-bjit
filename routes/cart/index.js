const express = require('express');
const Cart = require('../../controllers/cart');
const router = express.Router();
// const orderController = require('../../controllers/orders');
// const validateToken = require('../../middlewares/tokenValidator');

router.get('/all', Cart.getAllCartItems);

exports.router = router;
