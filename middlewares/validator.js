const { query } = require('express-validator');

const queryValidator = {
    filterProduct: [
        query('category')
            .optional()
            .custom((value, { req }) => {
                if (
                    value === undefined ||
                    (typeof value === 'string' && value.trim() !== '')
                ) {
                    return true;
                }
                throw new Error(
                    'Category must be a non-empty string if provided'
                );
            }),
        query('brand')
            .optional()
            .custom((value, { req }) => {
                if (
                    value === undefined ||
                    (typeof value === 'string' && value.trim() !== '')
                ) {
                    return true;
                }
                throw new Error('Brand must be a non-empty string if provided');
            }),
        query('ram')
            .optional()
            .custom((value, { req }) => {
                if (
                    value === undefined ||
                    (typeof value === 'string' && value.trim() !== '')
                ) {
                    return true;
                }
                throw new Error('Ram must be a non-empty string if provided');
            }),
        query('processor')
            .optional()
            .custom((value, { req }) => {
                if (
                    value === undefined ||
                    (typeof value === 'string' && value.trim() !== '')
                ) {
                    return true;
                }
                throw new Error(
                    'Processor must be a non-empty string if provided'
                );
            }),
        query('os')
            .optional()
            .custom((value, { req }) => {
                if (
                    value === undefined ||
                    (typeof value === 'string' && value.trim() !== '')
                ) {
                    return true;
                }
                throw new Error('OS must be a non-empty string if provided');
            }),
        query('storage')
            .optional()
            .custom((value, { req }) => {
                if (
                    value === undefined ||
                    (typeof value === 'string' && value.trim() !== '')
                ) {
                    return true;
                }
                throw new Error(
                    'Storage must be a non-empty string if provided'
                );
            }),
    ],
};

module.exports = queryValidator;
