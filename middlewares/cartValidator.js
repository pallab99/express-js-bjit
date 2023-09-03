const { failure } = require('../common/response');
const mongoose = require('mongoose');

const addToCartValidation = (req, res, next) => {
    const { user, products } = req.body;

    if (Array.isArray(products) && products.length === 0) {
        return res.status(400).json(
            failure('Unprocessable Entity', {
                products: 'Products required',
            })
        );
    }

    const error = {};

    const hasInvalidProductId =
        Array.isArray(products) &&
        products.some((prod) => !mongoose.Types.ObjectId.isValid(prod.product));
    const hasProductIdRequired =
        Array.isArray(products) && products.some((prod) => prod.product === '');
    const hasQuantityRequired =
        Array.isArray(products) &&
        products.some((prod) => parseInt(prod.quantity) === 0);

    if (
        !user ||
        user.trim().length === 0 ||
        !mongoose.Types.ObjectId.isValid(user)
    ) {
        error.user = 'User id is required';
    }

    if (hasQuantityRequired) {
        error.quantity = 'Quantity required';
    }

    if (hasProductIdRequired) {
        error.productRequired = 'Product id required';
    }

    if (hasInvalidProductId) {
        error.invalidProductId = 'Invalid product id';
    }

    if (Object.keys(error).length) {
        return res.status(400).json(failure('Unprocessable Entity', error));
    } else {
        next();
    }
};

module.exports = addToCartValidation;
