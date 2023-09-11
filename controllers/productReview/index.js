const { failure, success } = require('../../common/response');
const productReviewModel = require('../../model/productReview');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const ProductModel = require('../../model/products');
const userModel = require('../../model/user');
class productReviewController {
    /**
     * Adds a rating and review for a product.
     *
     * @param {Object} req - The request object containing the user, product, message, and rating.
     * @param {Object} res - The response object used to send the response.
     * @returns {Object} - The updated product review or an error message as a JSON response.
     */
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
                const userRatingExist = productExist.reviews.findIndex(
                    (ele) => {
                        return String(ele.user) === user;
                    }
                );
                if (userRatingExist != -1) {
                    (productExist.reviews[userRatingExist].user = user),
                        (productExist.reviews[userRatingExist].message =
                            message),
                        (productExist.reviews[userRatingExist].rating = rating),
                        await productExist.save();
                    const sum = productExist.reviews.reduce(
                        (accumulator, review) => accumulator + review.rating,
                        0
                    );
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
                    return res
                        .status(200)
                        .json(success('Successfully created the review', data));
                } else {
                    productExist.reviews.push({
                        user: user,
                        message: message,
                        rating: rating,
                    });
                    await productExist.save();
                    const sum = productExist.reviews.reduce(
                        (accumulator, review) => accumulator + review.rating,
                        0
                    );

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
                    if (data) {
                        return res
                            .status(200)
                            .json(
                                success('Successfully created the review', data)
                            );
                    } else {
                        return res
                            .status(200)
                            .json(failure('Something went wrong'));
                    }
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

                const sum = result.reviews.reduce(
                    (accumulator, review) => accumulator + review.rating,
                    0
                );

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

    /**
     * Retrieves the reviews for a specific product.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} - The response object with the retrieved reviews or an error message.
     */
    async getReviewByProduct(req, res) {
        try {
            const { productId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res
                    .status(400)
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

    /**
     * Retrieves all the reviews for a specific user.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with the retrieved reviews for the specified user or a failure message if there was an error.
     */
    async getReviewByUser(req, res) {
        try {
            const { userId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res
                    .status(400)
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
            const userReviewsMap = new Map();

            allReviews.forEach((review) => {
                review.reviews.forEach((userReview) => {
                    if (String(userReview.user._id) === userId) {
                        const productKey = String(review.product._id);
                        if (!userReviewsMap.has(productKey)) {
                            userReviewsMap.set(productKey, {
                                product: review.product,
                                userReviews: [],
                            });
                        }
                        userReviewsMap
                            .get(productKey)
                            .userReviews.push(userReview);
                    }
                });
            });

            const userReviews = Array.from(userReviewsMap.values());
            res.status(200).json(
                success('successfully get the data', userReviews)
            );
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async deleteReview(req, res) {
        try {
            const { user } = req.body;
            const { productId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(user)) {
                return res
                    .status(400)
                    .json(failure('Invalid user id provided'));
            }
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res
                    .status(400)
                    .json(failure('Invalid product id provided'));
            }
            var objectId = new mongoose.Types.ObjectId(productId);
            const result = await productReviewModel.findOne({
                product: objectId,
            });

            if (result) {
                const findUserReview = result.reviews.findIndex(
                    (ele) => String(ele.user) === user
                );

                console.log({ findUserReview });
                if (findUserReview === -1) {
                    return res.status(500).json(failure('Wrong user id'));
                }

                result.reviews.splice(findUserReview, 1);
                await result.save();
                return res
                    .status(500)
                    .json(success('Successfully deleted review'));
            } else {
                res.status(500).json(failure('Something went wrong'));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = new productReviewController();
