const { failure } = require('../common/response');

const validateProductsBeforeUpdate = (req, res, next) => {
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

    const isInvalidString = (value) =>
        typeof value !== 'string' || value.trim() === '';

    const isInvalidNumber = (value, max) =>
        isNaN(value) || value <= 0 || value > max;
    if (title !== undefined && isInvalidString(title)) {
        error.title = 'Title is required.';
    }

    if (price !== undefined && isInvalidNumber(price, 100)) {
        error.price =
            'Price must be a valid number greater than 0 and less than 100';
    }

    if (stock !== undefined && isInvalidNumber(stock, 300)) {
        error.stock =
            'Stock must be a valid number greater than 0 and less than 300';
    }

    if (description !== undefined && isInvalidString(description)) {
        error.description = 'Description is required.';
    }

    if (
        discountPercentage !== undefined &&
        isInvalidNumber(discountPercentage, 50)
    ) {
        error.discountPercentage =
            'DiscountPercentage is required and must be less than 50';
    }

    if ((rating !== undefined && isInvalidNumber(rating, 5)) || rating <= 0) {
        error.rating = 'Rating is required and must be between 0 to 5';
    }

    if (brand !== undefined && isInvalidString(brand)) {
        error.brand = 'Brand is required.';
    }

    if (category !== undefined && isInvalidString(category)) {
        error.category = 'Category is required.';
    }

    if (Object.keys(error).length > 0) {
        res.status(422).json(failure('Unprocessable Entity', error));
    }
    next();
};

module.exports = validateProductsBeforeUpdate;
