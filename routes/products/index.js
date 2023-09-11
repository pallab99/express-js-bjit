const express = require('express');
const router = express.Router();
const ProductController = require('./../../controllers/product/index');
const validator = require('../../middlewares/validator');
const {
    tokenAuthorization,
    isAdmin,
} = require('../../middlewares/tokenValidator');

const productController = new ProductController();

router
    .get('/all', validator.getAllProductsFilter, productController.getAll)
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
    .post(
        '/create',
        validator.createProduct,
        tokenAuthorization,
        isAdmin,
        productController.addData
    )
    .post('/review')
    .delete('/delete/:id', productController.deleteData)
    .patch(
        '/update/:id',
        validator.updateProduct,
        productController.updateData
    );

exports.router = router;
