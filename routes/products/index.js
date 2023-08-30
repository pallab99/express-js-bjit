const express = require('express');
const router = express.Router();
const Product = require('./../../controllers/product/index');
const validateProductsBeforeUpdate = require('../../middlewares/updateProductValidator');
const validator = require('../../middlewares/validator');

const productController = new Product();

router
    .get('/all', productController.getAll)
    .get('/details/:id', productController.getDataById)
    .get('/sortByPrice', productController.sortByPrice)
    .get('/filterByCategory', productController.filterByCategory)
    .get('/filterByBrand', productController.filterByBrand)
    .get(
        '/filterProducts',
        validator.filterProduct,
        productController.filterProducts
    )
    .get('/search', productController.searchByTitle)
    .post('/create', validator.createProduct, productController.addData)
    .delete('/delete/:id', productController.deleteData)
    .patch(
        '/update/:id',
        validateProductsBeforeUpdate,
        productController.updateData
    );

exports.router = router;
