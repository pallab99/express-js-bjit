const { failure, success } = require('../../common/response');
const cartModel = require('../../model/cart');
const ProductModel = require('../../model/products');
const transactionModel = require('../../model/transactions');
const mongoose = require('mongoose');
class Transaction {
    async createTransaction(req, res) {
        try {
            const { cartId, paymentMethod } = req.body;
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return res.status(400).json(failure('Invalid cart id'));
            }
            const cartData = await cartModel.findOne({ _id: cartId });
            if (cartData) {
                if (cartData.transactionComplete) {
                    return res
                        .status(400)
                        .json(failure('Transaction is already completed'));
                } else {
                    const newTransaction = await transactionModel.create({
                        cart: cartId,
                        paymentMethod,
                    });
                    cartData.transactionComplete = true;
                    await cartData.save();
                    const result = await transactionModel
                        .findOne({
                            _id: newTransaction._id,
                        })
                        .populate('cart');
                    console.log(result);

                    return res
                        .status(200)
                        .json(
                            success('Transaction saved successfully', result)
                        );
                }
            } else {
                return res.status(400).json(failure('Transaction failed'));
            }

            // console.log(productData);
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal server error'));
        }
    }
}

module.exports = new Transaction();
