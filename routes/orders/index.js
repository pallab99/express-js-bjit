const express = require('express');
const router = express.Router();
const orders = require('../../controllers/orders');
const validateToken = require('../../middlewares/tokenValidator');

router
    .get('/orders/all', validateToken, orders.getAllOrders)
    .get('/orders/details/:user_id', validateToken, orders.getOrderByUserId)
    .post('/orders/create', validateToken, orders.createOrders);

exports.router = router;
