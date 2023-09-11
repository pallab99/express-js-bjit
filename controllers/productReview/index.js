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
            const productFound = await ProductModel.findById(product);
            const userFound = await userModel.findById(user);
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

    async getReviewByProduct(req, res) {
        try {
            const { productId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res
                    .status(500)
                    .json(failure('Invalid product id provided'));
            }
            const result = await productReviewModel
                .find({
                    product: productId,
                })
                .populate('product', '-images -thumbnail')
                .populate('reviews')
                .populate(
                    'reviews.user',
                    '-address -phoneNumber -createdAt -updatedAt'
                );
            if (result.length > 0) {
                return res
                    .status(200)
                    .json(success('Successfully get the data', result));
            }
            return res.status(200).json(success('No data found', []));
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async getReviewByUser(req, res) {
        try {
            const { userId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res
                    .status(500)
                    .json(failure('Invalid user id provided'));
            }
            const allReviews = await productReviewModel
                .find({ 'reviews.user': userId })
                .populate('product', '-thumbnail -images')
                .populate('reviews')
                .populate(
                    'reviews.user',
                    '-address -phoneNumber -createdAt -updatedAt'
                );
            if (!allReviews.length) {
                return res.status(200).json(success('No data found', []));
            }
            const userReviews = allReviews.reduce((result, review) => {
                review.reviews.forEach((userReview) => {
                    if (String(userReview.user._id) === userId) {
                        result.push({ product: review.product, userReview });
                    }
                });
                return result;
            }, []);
            console.log(userReviews);
            res.status(200).json(
                success('successfully get the data', userReviews)
            );
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = new productReviewController();

// const userIds = allReviews.reviews.map((item) => String(item.user));
// console.log({ userIds });
// const result = await productReviewModel.find({
//     userId: { $in: userIds },
// });
// console.log({ result });
// const result = await productReviewModel.find({
//     product: productId,
// });
// if (result.length > 0) {
//     return res
//         .status(200)
//         .json(success('Successfully get the data', result));
// }
// return res.status(200).json(success('No data found', []));
