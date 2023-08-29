const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orders');
const validateToken = require('../../middlewares/tokenValidator');

router
    .get('/orders/all', validateToken, orderController.getAllOrders)
    .get(
        '/orders/details/:user_id',
        validateToken,
        orderController.getOrderByUserId
    )
    .post('/orders/create', validateToken, orderController.createOrders);

exports.router = router;
