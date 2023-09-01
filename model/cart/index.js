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
                    product: { type: Schema.Types.ObjectId, ref: 'Product' },
                    quantity: Number,
                },
            ],
            required: true,
        },
    },
    { timestamps: true }
);
const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel;
