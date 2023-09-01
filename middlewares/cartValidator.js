const { failure } = require('../common/response');
const mongoose = require('mongoose');

const addToCartValidation = (req, res, next) => {
    const { user, products } = req.body;

    const error = {};
    const invalidProductId = products.find(
        (prod) => !mongoose.Types.ObjectId.isValid(prod.product)
    );
    const productIdRequired = products.find((prod) => prod.product === '');
    const quantityRequired = products.find((prod) => prod.quantity === 0);
    if (user == undefined || user?.length === 0) {
        error.user = 'User id is required';
    }
    if (quantityRequired) {
        error.quantity = 'Quantity required';
    }
    if (productIdRequired) {
        error.productRequired = ' Product id required';
    }
    if (invalidProductId) {
        error.invalidProductId = ' Invalid product id';
    }
    console.log(error);
    if (Object.keys(error).length) {
        return res.status(400).json(failure('Unprocessable Entity', error));
    } else {
        next();
    }
};

module.exports = addToCartValidation;
