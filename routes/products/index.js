const express = require('express');
const router = express.Router();
const Product = require('./../../controllers/product/index');
const validateProductsBeforeAdd = require('../../middlewares/addProductValidator');
const validateProductsBeforeUpdate = require('../../middlewares/updateProductValidator');
const queryValidator = require('../../middlewares/validator');

const productController = new Product();

router
    .get('/all', productController.getAll)
    .get('/details/:id', productController.getDataById)
    .get('/sortByPrice', productController.sortByPrice)
    .get('/filterByCategory', productController.filterByCategory)
    .get('/filterByBrand', productController.filterByBrand)
    .get(
        '/filterProducts',
        queryValidator.filterProduct,
        productController.filterProducts
    )
    .get('/search', productController.searchByTitle)
    .post('/create', validateProductsBeforeAdd, productController.addData)
    .delete('/delete/:id', productController.deleteData)
    .patch(
        '/update/:id',
        validateProductsBeforeUpdate,
        productController.updateData
    );

exports.router = router;
