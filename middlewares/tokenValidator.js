const { failure } = require('../common/response');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
const userModel = require('../model/user');
dotEnv.config();

const AUTH_FAILURE_MSG = 'Authorization failed.Please Sign in.';

const validateToken = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
    const charset = process.env.ACCESS_TOKEN_SECRET;
    if (token === undefined) {
        res.status(401).json(failure(AUTH_FAILURE_MSG));
    } else {
        try {
            const decoded = await verifyToken(token, charset);
            const { id } = decoded;
            const user = await userModel.findById(id);
            if (user && !user.isValidSession) {
                res.status(401).json(failure(AUTH_FAILURE_MSG));
            } else {
                next();
            }
        } catch (err) {
            res.status(401).json(failure(AUTH_FAILURE_MSG));
        }
    }
};

const verifyToken = (token, charset) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, charset, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

module.exports = validateToken;
