const { failure, success } = require('../../common/response');
const cartModel = require('../../model/cart');

class Cart {
    async getAllCartItems(req, res) {
        try {
            const data = await cartModel
                .find({})
                .populate('products.product', '-images -thumbnail')
                .populate('user', '-password -token');
            const products = data.map((ele) =>
                ele.products.map((prod) => prod)
            );
            const subTotal = products.flatMap((productGroup) =>
                productGroup.map(
                    (product) => product.quantity * product.product.price
                )
            );

            const sum = subTotal.reduce((total, amount) => total + amount, 0);

            console.log(subTotal);
            const newData = {
                data,
                totalAmount: sum,
            };
            if (data.length) {
                res.status(200).json(
                    success('Successfully get the data', newData)
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
            const { user, products } = req.body;
            let result = await cartModel.insertMany({
                user,
                products,
            });
            // let abc=await cartModel.
            // console.log(result[0].products);
            if (result.length) {
                res.status(201).json(success('Added to cart successfully'));
            } else {
                res.status(500).json(failure('Something went wrong'));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal server error'));
        }
    }
}

module.exports = new Cart();
