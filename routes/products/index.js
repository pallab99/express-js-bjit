const express = require('express');
const router = express.Router();
const Product = require('./../../controllers/product/index');
const validateProductsBeforeAdd = require('../../middlewares/addProductValidator');
const validateProductsBeforeUpdate = require('../../middlewares/updateProductValidator');

const productController = new Product();

router
    .get('/products/all', productController.getAll)
    .get('/products/details/:id', productController.getDataById)
    .get('/products/sortByPrice', productController.sortByPrice)
    .post(
        '/products/create',
        validateProductsBeforeAdd,
        productController.addData
    )
    .delete('/products/delete/:id', productController.deleteData)
    .put(
        '/products/update/:id',
        validateProductsBeforeUpdate,
        productController.updateData
    );

exports.router = router;
