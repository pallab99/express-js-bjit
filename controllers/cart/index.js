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
            if (!mongoose.Types.ObjectId.isValid(user) || !user || user == '') {
                return res.status(400).json(failure('Invalid user id'));
            }
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json(failure('Invalid product id'));
            }
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
                    console.log('existingCart');
                    const productData = await ProductModel.findById(productId);
                    if (productData.stock >= quantity) {
                        const newCart = await cartModel.create({ user: user });
                        newCart.products.push({
                            product: productId,
                            quantity,
                        });
                        await newCart.save();
                        const cart = await cartModel
                            .findOne({ user: user })
                            .populate('products.product');
                        // console.log('jjjj', cart);
                        let sum = 0;
                        const total = cart.products.map((ele) => {
                            console.log('dddd', ele.product);
                            sum += ele.product.price * ele.quantity;
                            return sum;
                        });
                        console.log('ff', total);
                        newCart.total = total[0];
                        await newCart.save();

                        if (newCart) {
                            return res
                                .status(201)
                                .json(
                                    success(
                                        'Added to new cart successfully',
                                        newCart
                                    )
                                );
                        } else {
                            return res
                                .status(400)
                                .json(failure('Something went wrong'));
                        }
                    } else {
                        return res
                            .status(400)
                            .json(failure('Not enough stock available'));
                    }
                } else {
                    const cart = await cartModel.findOne({ user: user });

                    const existingProduct = cart.products.find((ele) => {
                        return String(ele.product) === productId;
                    });
                    const allProducts = await cartModel
                        .findOne({ user: user })
                        .populate('products.product');
                    if (existingProduct) {
                        const productData =
                            await ProductModel.findById(productId);

                        if (
                            productData.stock >=
                            existingProduct.quantity + quantity
                        ) {
                            existingProduct.quantity += quantity;
                        } else {
                            return res
                                .status(400)
                                .json(failure('Not enough stock available'));
                        }
                    } else {
                        const productData =
                            await ProductModel.findById(productId);
                        if (productData.stock >= quantity) {
                            cart.products.push({
                                product: productId,
                                quantity: quantity,
                            });
                        } else {
                            return res
                                .status(400)
                                .json(failure('Not enough stock available'));
                        }
                    }
                    await cart.save();

                    let sum = 0;
                    const total = allProducts.products.map((ele) => {
                        sum += ele.product.price * ele.quantity;
                        // console.log(ele.product);
                        return sum;
                    });
                    // console.log('ff', total);

                    cart.total = total[0];
                    await cart.save();
                    // const data = {

                    // };
                    return res
                        .status(200)
                        .json(success('Added to the existing cart', cart));
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal server error'));
        }
    }

    async updateCart(req, res) {
        try {
            const { cartId } = req.params;
            const { productId, quantity } = req.body;
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return res.status(400).json(failure('Invalid cart id'));
            }
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json(failure('Invalid product id'));
            }
            const cart = await cartModel.findOne({ _id: cartId });
            if (!cart) {
                return res.status(400).json(failure('Invalid cart'));
            }
            const existingProduct = cart.products.filter((ele) => {
                return String(ele.product) == productId;
            });
            const index = cart?.products?.findIndex((ele) => {
                return String(ele.product) == productId;
            });
            if (index != -1) {
                if (existingProduct[0]?.quantity > quantity) {
                    existingProduct[0].quantity -= quantity;
                    await cart.save();
                } else {
                    cart.products.splice(index, 1);
                    await cart.save();
                }

                await cart.save();
                const allProducts = await cartModel
                    .findOne({ _id: cartId })
                    .populate('products.product');
                let sum = 0;
                const total = allProducts.products.map((ele) => {
                    sum += ele.product.price * ele.quantity;
                    // console.log(ele.product);
                    return sum;
                });
                // console.log('ff', total);

                cart.total = total[0];
                await cart.save();

                return res
                    .status(200)
                    .json(success('Updated cart successfully', cart));
            } else {
                return res
                    .status(400)
                    .json(failure('The product was not found in the cart'));
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
