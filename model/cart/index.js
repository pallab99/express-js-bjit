const mongoose = require('mongoose');
const { Schema } = mongoose;
const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: {
            type: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: 'Product',
                        required: true,
                    },
                    quantity: Number,
                    _id: false,
                },
            ],
        },
        total: {
            type: Number,
            required: false,
        },
    },
    { timestamps: true }
);
const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel;
