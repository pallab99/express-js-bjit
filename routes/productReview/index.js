const express = require('express');
const productReview = require('../../controllers/productReview');
const validator = require('../../middlewares/validator');
const { tokenAuthorization } = require('../../middlewares/tokenValidator');

const router = express.Router();

router
    .post(
        '/create',
        tokenAuthorization,
        validator.addProductReview,
        productReview.addRating
    )
    .get(
        '/getReviewByProduct/:productId',
        tokenAuthorization,
        productReview.getReviewByProduct
    )
    .get(
        '/getReviewByUser/:userId',
        tokenAuthorization,
        productReview.getReviewByUser
    )
    .delete(
        '/deleteReview/:productId',
        tokenAuthorization,
        productReview.deleteReview
    );

exports.router = router;
