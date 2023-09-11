const express = require('express');
const productReview = require('../../controllers/productReview');
const validator = require('../../middlewares/validator');

const router = express.Router();

router
    .post('/create', validator.addProductReview, productReview.addRating)
    .get('/getReviewByProduct/:productId', productReview.getReviewByProduct)
    .get('/getReviewByUser/:userId', productReview.getReviewByUser);

exports.router = router;
