const { query } = require('express-validator');

const queryValidator = {
    filterProduct: [
        query('category')
            .optional()
            .isString()
            .withMessage('category must be of type string'),
        query('brand')
            .optional()
            .isString()
            .withMessage('brand must be of type string'),
        query('ram')
            .optional()
            .isString()
            .withMessage('ram must be of type string'),
        query('processor')
            .optional()
            .isString()
            .withMessage('processor must be of type string'),
        query('os')
            .optional()
            .isString()
            .withMessage('os must be of type string'),
        query('storage')
            .optional()
            .isString()
            .withMessage('storage must be of type string'),
    ],
};

module.exports = queryValidator;
