const { failure, success } = require('../../common/response');
const productReviewModel = require('../../model/productReview');
const mongoose = require('mongoose');
const { Types } = mongoose;
class productReviewController {
    async addRating(req, res) {
        try {
            const { user, product, message, rating } = req.body;

            const productExist = await productReviewModel.findOne({
                product: String(product),
            });
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
                    res.status(200).json(
                        success('Successfully created the review', data)
                    );
                } else {
                    res.status(200).json(failure('Something went wrong'));
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
