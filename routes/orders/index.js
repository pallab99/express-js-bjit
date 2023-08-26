const express = require('express');
const router = express.Router();
const orders = require('../../controllers/orders');

router
    .get('/orders/all', orders.getAllOrders)
    .get('/orders/details/:user_id', orders.getOrderByUserId)
    .post('/orders/create', orders.createOrders);

exports.router = router;
