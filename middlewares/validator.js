const { query, body } = require('express-validator');
const { EMAIL_REGEX, PHONE_REGEX } = require('../constant');

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
            .exists()
            .not()
            .equals('')
            .withMessage('Name is required')
            .bail()
            .isString()
            .withMessage('Name Must be of type string'),
        body('email')
            .exists()
            .not()
            .equals('')
            .withMessage('Email is required')
            .bail()
            .isString()
            .withMessage('Email Must be of type string')
            .bail()
            .isEmail()
            .withMessage('Invalid email address'),
        body('password')
            .exists()
            .not()
            .equals('')
            .withMessage('Password is required')
            .bail()
            .custom((value, { req }) => {
                let { name, email } = req.body;
                name = name.replace(/\s+/g, '');
                email = email.split('@')[0];
                const nameRegex = new RegExp(name, 'i');
                const emailRegex = new RegExp(email, 'i');
                if (nameRegex.test(value) || emailRegex.test(value)) {
                    throw new Error(
                        'Password cannot contain your username or email'
                    );
                } else {
                    return true;
                }
            })
            .bail()
            .isString()
            .withMessage('Password Must be of type string')
            .bail()
            .isStrongPassword({
                minLength: 8,
                minLowerCase: 1,
                minUpperCase: 1,
                minSymbols: 1,
                minNumbers: 1,
            })
            .withMessage(
                'Password must be at least 8 characters with a lowercase ,a uppercase,a number and a special character'
            ),

        body('phoneNumber')
            .exists()
            .not()
            .equals('')
            .withMessage('PhoneNumber is required')
            .bail()
            .isNumeric()
            .withMessage('PhoneNumber must be a number')
            .bail()
            .custom((data) => {
                if (PHONE_REGEX.test(data)) {
                    return true;
                } else {
                    throw new Error('This is not a valid phone number');
                }
            }),
        body('rank')
            .optional()
            .custom((data) => {
                if (data > 0 && data < 10 && typeof data === 'number') {
                    return true;
                }
                throw new Error('Rank must be between 1 and 10');
            })
            .bail()
            .isNumeric()
            .withMessage('Rank must be a number'),
        body('address.country')
            .exists()
            .not()
            .equals('')
            .withMessage('Country is required')
            .bail()
            .isString()
            .withMessage('Country only be string'),
        body('address.city')
            .exists()
            .not()
            .equals('')
            .withMessage('City is required')
            .bail()
            .isString()
            .withMessage('City only be string'),
        body('address.area')
            .exists()
            .not()
            .equals('')
            .withMessage('Area is required')
            .bail()
            .isString()
            .withMessage('Area only be string'),
        body('address.street')
            .exists()
            .not()
            .equals('')
            .withMessage('Street is required')
            .bail()
            .isString()
            .withMessage('Street only be string'),
    ],

    loginUser: [
        body('email')
            .not()
            .equals('')
            .withMessage('Email is required')
            .bail()
            .isString()
            .withMessage('Email Must be of type string')
            .bail()
            .isEmail()
            .withMessage('Invalid email address'),
        body('password')
            .not()
            .equals('')
            .withMessage('Password is required')
            .bail()
            .isString()
            .withMessage('Password Must be of type string')
            .bail()
            .isStrongPassword({
                minLength: 8,
                minLowerCase: 1,
                minUpperCase: 1,
                minSymbols: 1,
                minNumbers: 1,
            })
            .withMessage(
                'Password must be at least 8 characters with a lowercase ,a uppercase,a number and a special character'
            ),
    ],

    getAllProductsFilter: [
        query('sortBy')
            .optional()
            .not()
            .equals('')
            .withMessage('SortBy cannot be empty')
            .bail()
            .custom((value) => {
                if (
                    value === 'price' ||
                    value === 'stock' ||
                    value === 'rating'
                ) {
                    return true;
                } else {
                    throw new Error('Invalid property provided for sortBy');
                }
            }),
        query('sortOrder')
            .optional()
            .not()
            .equals('')
            .withMessage('sortOrder cannot be empty')
            .bail()
            .custom((value) => {
                if (value === 'asc' || value === 'desc') {
                    return true;
                } else {
                    throw new Error('Invalid property provided for sortOrder');
                }
            }),
        query('filter')
            .optional()
            .not()
            .equals('')
            .withMessage('filter cannot be empty')
            .bail()
            .custom((value) => {
                if (
                    value === 'stock' ||
                    value === 'price' ||
                    value === 'rating' ||
                    value === 'discountPercentage'
                ) {
                    return true;
                } else {
                    throw new Error('Invalid property provided for filter');
                }
            }),
        query('filterOrder')
            .optional()
            .not()
            .equals('')
            .withMessage('filterOrder cannot be empty')
            .bail()
            .custom((value) => {
                if (value === 'high' || value === 'low') {
                    return true;
                } else {
                    throw new Error(
                        'Invalid property provided for filterOrder'
                    );
                }
            }),
        query('filterValue')
            .optional()
            .not()
            .equals('')
            .withMessage('filterValue cannot be empty')
            .bail()
            .custom((value) => {
                value = parseInt(value);
                console.log(value);
                if (!isNaN(value)) {
                    return true;
                } else {
                    throw new Error('Filter value must be a number');
                }
            }),
        query('brand')
            .optional()
            .custom((value) => {
                console.log(value);
                if (value.length) {
                    return true;
                } else {
                    throw new Error('Brand cannot be empty');
                }
            }),
        query('Category')
            .optional()
            .custom((value) => {
                console.log(value);
                if (value.length) {
                    return true;
                } else {
                    throw new Error('Category cannot be empty');
                }
            }),
    ],
};

module.exports = validator;
