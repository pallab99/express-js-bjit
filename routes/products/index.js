const express = require('express');
const router = express.Router();
const Product = require('./../../controllers/product/index');
const validateProductsBeforeAdd = require('../../middlewares/addProductValidator');
const validateProductsBeforeUpdate = require('../../middlewares/updateProductValidator');

const productController = new Product();

router
    .get('/all', productController.getAll)
    .get('/details/:id', productController.getDataById)
    .get('/sortByPrice', productController.sortByPrice)
    .get('/filterByCategory', productController.filterByCategory)
    .get('/filterByBrand', productController.filterByBrand)
    .post('/create', validateProductsBeforeAdd, productController.addData)
    .delete('/delete/:id', productController.deleteData)
    .patch(
        '/update/:id',
        validateProductsBeforeUpdate,
        productController.updateData
    );

exports.router = router;
