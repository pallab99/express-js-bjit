const { failure } = require('../common/response');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config();

const tokenAuthorization = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res
                .status(401)
                .send(failure('Unable to access.Please login'));
        }
        const { authorization } = req.headers;
        const token = authorization?.split(' ')[1];
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);
        if (validate) {
            next();
        } else {
            return res
                .status(401)
                .send(failure('Unable to access.Please login'));
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send(failure('Unauthorized access'));
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send(failure('Unauthorized access'));
        }
        return res.status(401).send(failure('Unauthorized access'));
    }
};

const isAdmin = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res
                .status(401)
                .send(failure('Unable to access.Please login'));
        }
        const { authorization } = req.headers;
        const token = authorization?.split(' ')[1];
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);
        // console.log(validate.rank === 1);
        if (validate.rank === 1) {
            next();
        } else {
            return res.status(401).send(failure('Unable to access'));
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send(failure('Unauthorized access'));
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send(failure('Unauthorized access'));
        }
        return res.status(401).send(failure('Unauthorized access'));
    }
};
module.exports = { tokenAuthorization, isAdmin };
