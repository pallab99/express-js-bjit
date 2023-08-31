const express = require('express');
const router = express.Router();
const ProductController = require('./../../controllers/product/index');
const validateProductsBeforeUpdate = require('../../middlewares/updateProductValidator');
const validator = require('../../middlewares/validator');

const productController = new ProductController();

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
    .get('/search', productController.searchProducts)
    .post('/create', validator.createProduct, productController.addData)
    .delete('/delete/:id', productController.deleteData)
    .patch(
        '/update/:id',
        validator.updateProduct,
        productController.updateData
    );

exports.router = router;
