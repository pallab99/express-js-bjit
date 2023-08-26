const { failure } = require('../common/response');

const validateToken = (req, res, next) => {
    if (req.headers.authorization === undefined) {
        return res.status(401).json(failure('Please sign in'));
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token === req.cookies.token) {
        next();
    } else {
        return res.status(401).json(failure('Please sign in'));
    }
};

module.exports = validateToken;
