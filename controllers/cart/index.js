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
}

module.exports = new Cart();
