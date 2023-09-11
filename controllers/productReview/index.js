const { failure, success } = require('../../common/response');
const productReviewModel = require('../../model/productReview');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const ProductModel = require('../../model/products');
const userModel = require('../../model/user');
class productReviewController {
    async addRating(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length) {
                const error = {};
                validation.forEach((validationError) => {
                    const property = validationError.path;
                    error[property] = validationError.msg;
                });
                return res
                    .status(422)
                    .json(failure('Unprocessable Entity', error));
            }
            const { user, product, message, rating } = req.body;

            const productExist = await productReviewModel.findOne({
                product: String(product),
            });
            const productFound = await ProductModel.findOne({
                product: product,
            });
            const userFound = await userModel.findOne({ user: user });
            if (!userFound) {
                return res.status(200).json(failure('No user found'));
            }
            if (!productFound) {
                return res.status(200).json(failure('No product found'));
            }
            if (productExist) {
                productExist.reviews.push({
                    user: user,
                    message: message,
                    rating: rating,
                });
                await productExist.save();
                let sum = 0;

                for (let i = 0; i < productExist.reviews.length; i++) {
                    sum += productExist.reviews[i].rating;
                }

                const avg = sum / productExist.reviews.length;

                productExist.averageRating = avg;
                await productExist.save();

                const data = {
                    _id: productExist?._id,
                    product: productExist?.product,
                    averageRating: productExist?.averageRating.toFixed(2),
                    review: productExist?.reviews[
                        productExist.reviews.length - 1
                    ],
                };
                if (productExist) {
                    return res
                        .status(200)
                        .json(success('Successfully created the review', data));
                } else {
                    return res
                        .status(200)
                        .json(failure('Something went wrong'));
                }
            } else {
                const result = await productReviewModel.create({
                    product,
                });

                result.reviews.push({
                    user: user,
                    message: message,
                    rating: rating,
                });
                await result.save();

                let sum = 0;

                for (let i = 0; i < result.reviews.length; i++) {
                    sum += result.reviews[i].rating;
                }

                const avg = sum / result.reviews.length;

                result.averageRating = avg;
                await result.save();

                if (result) {
                    res.status(200).json(
                        success('Successfully get the data', result)
                    );
                } else {
                    res.status(200).json(failure('Something went wrong'));
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = new productReviewController();
