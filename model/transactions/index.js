const mongoose = require('mongoose');
const { Schema } = mongoose;
const transactionSchema = new Schema(
    {
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
const transactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = transactionModel;
