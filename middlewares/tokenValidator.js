const { failure } = require('../common/response');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config();
const validateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    const charset = process.env.ACCESS_TOKEN_SECRET;
    if (token === undefined) {
        res.status(401).json(failure('Authorization failed.Please Sign in.'));
    } else {
        jwt.verify(token, charset, (err, decoded) => {
            if (err) {
                res.status(401).json(
                    failure('Authorization failed.Please Sign in.')
                );
            } else {
                next();
            }
        });
    }
};

module.exports = validateToken;
