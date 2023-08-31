const { query, body } = require('express-validator');
const { EMAIL_REGEX } = require('../constant');

const validator = {
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

    createProduct: [
        body('title').notEmpty().withMessage('Title is required.'),
        body('description').notEmpty().withMessage('Description is required.'),
        body('price')
            .isFloat({ min: 0, max: 100 })
            .withMessage('Price must be a valid number between 0 and 100.'),
        body('discountPercentage')
            .isFloat({ min: 0, max: 50 })
            .withMessage(
                'DiscountPercentage is required and must be less than 50.'
            ),
        body('rating')
            .isFloat({ min: 0, max: 5 })
            .withMessage('Rating is required and must be between 0 and 5.'),
        body('stock')
            .isFloat({ min: 0, max: 300 })
            .withMessage('Stock must be a valid number between 0 and 300.'),
        body('brand').notEmpty().withMessage('Brand is required.'),
        body('category').notEmpty().withMessage('Category is required.'),
    ],

    updateProduct: [
        body('title')
            .optional()
            .custom((value) => typeof value === 'string' && value.trim() !== '')
            .withMessage('Title is required.'),
        body('description')
            .optional()
            .custom((value) => typeof value === 'string' && value.trim() !== '')
            .withMessage('Description is required.'),
        body('price')
            .optional()
            .isFloat({ min: 0, max: 100 })
            .withMessage('Price must be a valid number between 0 and 100.'),
        body('discountPercentage')
            .optional()
            .isFloat({ min: 0, max: 50 })
            .withMessage(
                'DiscountPercentage must be a valid number less than 50.'
            ),
        body('rating')
            .optional()
            .isFloat({ min: 0, max: 5 })
            .withMessage('Rating must be a valid number between 0 and 5.'),
        body('stock')
            .optional()
            .isFloat({ min: 0, max: 300 })
            .withMessage('Stock must be a valid number between 0 and 300.'),
        body('brand')
            .optional()
            .custom((value) => typeof value === 'string' && value.trim() !== '')
            .withMessage('Brand is required.'),
        body('category')
            .optional()
            .custom((value) => typeof value === 'string' && value.trim() !== '')
            .withMessage('Category is required.'),
    ],

    signUpUser: [
        body('name')
            .not()
            .equals('')
            .withMessage('Name is required')
            .bail()
            .isString()
            .withMessage('Name Must be of type string'),
        body('email')
            .not()
            .equals('')
            .withMessage('Email is required')
            .bail()
            .isString()
            .withMessage('Email Must be of type string')
            .custom((val) => EMAIL_REGEX.test(val))
            .withMessage('Invalid email'),
        body('password')
            .not()
            .equals('')
            .withMessage('Password is required')
            .bail()
            .isString()
            .withMessage('Password Must be of type string'),
    ],
};

module.exports = validator;
