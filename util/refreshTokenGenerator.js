const dotEnv = require('dotenv');
dotEnv.config();
const jwt = require('jsonwebtoken');

const generateSecretRefreshToken = (body) => {
    const payload = {
        id: body._id,
        email: body.email,
    };
    const charset = process.env.REFRESH_TOKEN_SECRET;
    const token = jwt.sign(payload, charset);
    return token;
};

module.exports = generateSecretRefreshToken;
