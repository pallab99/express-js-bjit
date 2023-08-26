const express = require('express');
// const product = require('../../controllers/product');
const router = express.Router();
const Product = require('./../../controllers/product/index');
const product = new Product();
router
    .get('/products/all', product.getAll)
    .get('/products/details/:id', product.getDataById)
    .post('/products/create', product.addData);

exports.router = router;
