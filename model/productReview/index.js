const mongoose = require('mongoose');
const { Schema } = mongoose;
const reviewSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        reviews: {
            type: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                    },
                    message: {
                        type: String,
                    },
                    rating: Number,

                    _id: false,
                },
            ],
            required: true,
        },
        averageRating: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);
const productReviewModel = mongoose.model('Review', reviewSchema);
module.exports = productReviewModel;
