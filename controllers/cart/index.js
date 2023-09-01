const { failure, success } = require('../../common/response');
const cartModel = require('../../model/cart');
const ProductModel = require('../../model/products');
const mongoose = require('mongoose');

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

            const productId = products.map((ele) => ele.product);
            const productsData = await ProductModel.find({
                _id: { $in: productId },
            });

            const totalAmount = productsData.reduce((acc, product, index) => {
                return acc + product.price * products[index].quantity;
            }, 0);

            let result = await cartModel.insertMany({
                user,
                products,
                totalAmount,
            });

            if (result.length) {
                res.status(201).json(
                    success('Added to cart successfully', result)
                );
            } else {
                res.status(500).json(failure('Something went wrong'));
            }
        } catch (error) {
            res.status(500).json(failure('Internal server error'));
        }
    }

    async getCartByUserId(req, res) {
        try {
            const { userId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json(failure('Invalid user id'));
            }
            const data = await cartModel
                .find({ user: userId })
                .populate('products.product', '-images -thumbnail')
                .populate('user', '-password -token');
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
    async getCartItemsById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json(failure('Invalid user id'));
            }
            const data = await cartModel
                .find({ _id: id })
                .populate('products.product', '-images -thumbnail')
                .populate('user', '-password -token');
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
