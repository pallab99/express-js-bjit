const express = require('express');
const Cart = require('../../controllers/cart');
const validateToken = require('../../middlewares/tokenValidator');
const addToCartValidation = require('../../middlewares/cartValidator');
const router = express.Router();
// const passport = require('passport');
// const passportJWTAuth = passport.authenticate('jwt', { session: false });
router
    .post(
        '/create',
        validateToken.tokenAuthorization,
        addToCartValidation,
        Cart.addToCart
    )
    .patch('/updateCart/:cartId', Cart.updateCart);

exports.router = router;

//     .get('/all', validateToken, Cart.getAllCartItems)
//     .get('/details/:userId', validateToken, Cart.getCartByUserId)
//     .get('/userOrderDetails/:id', validateToken, Cart.getCartItemsById)
