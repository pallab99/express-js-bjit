const { failure, success } = require('../../common/response');
const cartModel = require('../../model/cart');
const ProductModel = require('../../model/products');
const mongoose = require('mongoose');
const userModel = require('../../model/user');

class Cart {
    async getAllCartItems(req, res) {
        try {
            const data = await cartModel
                .find({})
                .populate('products.product', '-images -thumbnail')
                .populate(
                    'user',
                    '-password -isValidSession -__v -uuid -createdAt -updatedAt'
                );
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
            res.status(500).json(failure('Internal server error'));
        }
    }

    async addToCart(req, res) {
        try {
            const { user, productId, quantity } = req.body;
            const userExistsInUserModel = await userModel.findById(user);
            const productExistsInProductModel =
                await ProductModel.findById(productId);
            if (!userExistsInUserModel) {
                return res.status(400).json(failure('User Id not found'));
            }
            if (!productExistsInProductModel) {
                return res.status(400).json(failure('Product Id not found'));
            } else {
                const existingCart = await cartModel.findOne({ user: user });
                if (!existingCart) {
                    const newCart = await cartModel.create({ user: user });
                    newCart.products.push({
                        product: productId,
                        quantity,
                    });
                    await newCart.save();
                    console.log({ newCart });
                    if (newCart) {
                        return res
                            .status(201)
                            .json(
                                success('Added to cart successfully', result)
                            );
                    } else {
                        return res
                            .status(400)
                            .json(failure('Something went wrong'));
                    }
                } else {
                    const cart = await cartModel
                        .findOne({ user: user })
                        .populate('user')
                        .populate('products.product', '-images -thumbnail');
                    const products = cart.products;

                    // console.log(products[0].product);

                    // const existingProduct = products.findIndex((product) => {
                    //     const prodId = product.product._id
                    //         .toString()
                    //         .split('(')[0];
                    //     // console.log(prodId);
                    //     prodId == productId;
                    // });

                    // console.log(existingProduct);
                    console.log(products);
                    const productIds = products.map((ele) =>
                        String(ele.product._id)
                    );
                    console.log({ productIds });
                    console.log({ productId });
                    const existingProduct = await cartModel.find({
                        productId: { $in: productIds },
                    });
                    console.log({ existingProduct });
                    // for (let i = 0; i < products.length; i++) {
                    //     console.log(products[i].product._id);

                    //     const existingProduct = await cartModel.find({
                    //         _id: products[i].product._id,
                    //     });

                    //     console.log({ existingProduct });
                    // }
                }
            }
        } catch (error) {
            console.log(error);
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
                .populate(
                    'user',
                    '-password -isValidSession -__v -uuid -createdAt -updatedAt'
                );
            if (data.length) {
                res.status(200).json(
                    success('Successfully get the data', data)
                );
            } else {
                res.status(200).json(success('No data found', []));
            }
        } catch (error) {
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
                .populate(
                    'user',
                    '-password -isValidSession -__v -uuid -createdAt -updatedAt'
                );
            if (data.length) {
                res.status(200).json(
                    success('Successfully get the data', data)
                );
            } else {
                res.status(200).json(success('No data found', []));
            }
        } catch (error) {
            res.status(500).json(failure('Internal server error'));
        }
    }
}

module.exports = new Cart();
