const dotEnv = require('dotenv');
dotEnv.config();
const jwt = require('jsonwebtoken');

const generateSecretRefreshToken = (body) => {
    const charset = process.env.REFRESH_TOKEN_SECRET;
    const token = jwt.sign(body, charset, { expiresIn: '1y' });
    return token;
};

module.exports = generateSecretRefreshToken;
