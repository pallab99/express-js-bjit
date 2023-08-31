const mongoose = require('mongoose');
const { Schema } = mongoose;
const cartSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    addedAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
    noOfProduct: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    },
});
const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel;
