const express = require('express');
const productReview = require('../../controllers/productReview');

const router = express.Router();

router.post('/create', productReview.addRating);

exports.router = router;
