const { failure, success } = require('../../common/response');
const cartModel = require('../../model/cart');

class Cart {
    async getAllCartItems(req, res) {
        try {
            const data = await cartModel
                .find({})
                .populate('product')
                .populate('user');
            if (data.length) {
                res.status(200).json(
                    success('Successfully get the data', data)
                );
            } else {
                res.status(200).json(success('No data found', []));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal server error'));
        }
    }

    async addToCart(req, res) {
        try {
            const { user, product, noOfProduct, totalAmount } = req.body;
            const result = await cartModel.insertMany({
                user,
                product,
                noOfProduct,
                totalAmount,
            });
            if (result.length) {
                res.status(201).json(success('Added to cart successfully'));
            } else {
                res.status(500).json(failure('Something went wrong'));
            }
        } catch (error) {
            res.status(500).json(failure('Internal server error'));
        }
    }
}

module.exports = new Cart();
