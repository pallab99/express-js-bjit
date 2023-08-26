const express = require('express');
const router = express.Router();
const orders = require('../../controllers/orders');
router.post('/orders/create', orders.createOrders);

exports.router = router;
