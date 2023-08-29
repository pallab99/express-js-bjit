const { failure } = require('../common/response');

const validateProductsBeforeAdd = (req, res, next) => {
    const body = req.body;
    const {
        title,
        description,
        price,
        discountPercentage,
        rating,
        stock,
        brand,
        category,
    } = body;
    const error = {};

    const isInvalidNumber = (value) => isNaN(value) || value < 0;
    const isInvalidString = (value) =>
        typeof value !== 'string' || value.trim() === '';

    if (isInvalidString(title)) {
        error.title = 'Title is required.';
    }

    if (isInvalidNumber(price) || price > 100) {
        error.price =
            'Price must be a valid number greater than 0 and less than 100';
    }

    if (isInvalidNumber(stock) || stock > 300) {
        error.stock =
            'Stock must be a valid number greater than 0 and less than 100';
    }

    if (isInvalidString(description)) {
        error.description = 'Description is required.';
    }

    if (isInvalidNumber(discountPercentage) || discountPercentage > 50) {
        error.discountPercentage =
            'DiscountPercentage is required and must be less than 50';
    }

    if (isInvalidNumber(rating) || rating <= 0 || rating > 5) {
        error.rating = 'Rating is required and must be between 0 to 5';
    }

    if (isInvalidString(brand)) {
        error.brand = 'Brand is required.';
    }

    if (isInvalidString(category)) {
        error.category = 'Category is required.';
    }
    if (Object.keys(error).length > 0) {
        res.status(401).json(failure('Unprocessable Entity', error));
    }
    next();
};

module.exports = validateProductsBeforeAdd;
