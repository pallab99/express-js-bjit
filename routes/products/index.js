const express = require('express');
const router = express.Router();
const Product = require('./../../controllers/product/index');

const product = new Product();

router
    .get('/products/all', product.getAll)
    .get('/products/details/:id', product.getDataById)
    .post('/products/create', product.addData)
    .delete('/products/delete/:id', product.deleteData)
    .put('/products/update/:id', product.updateData);

exports.router = router;
