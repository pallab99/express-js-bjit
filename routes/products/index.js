const express = require('express');
const router = express.Router();
const Product = require('./../../controllers/product/index');
const validateProductsBeforeAdd = require('../../middlewares/addProductValidator');
const validateProductsBeforeUpdate = require('../../middlewares/updateProductValidator');

const product = new Product();

router
    .get('/products/all', product.getAll)
    .get('/products/details/:id', product.getDataById)
    .get('/products/sortByPrice', product.sortByPrice)
    .post('/products/create', validateProductsBeforeAdd, product.addData)
    .delete('/products/delete/:id', product.deleteData)
    .put(
        '/products/update/:id',
        validateProductsBeforeUpdate,
        product.updateData
    );

exports.router = router;
