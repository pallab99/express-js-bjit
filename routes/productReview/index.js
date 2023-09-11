const express = require('express');
const productReview = require('../../controllers/productReview');
const validator = require('../../middlewares/validator');

const router = express.Router();

router.post('/create', validator.addProductReview, productReview.addRating);

exports.router = router;
