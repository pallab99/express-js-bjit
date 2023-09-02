const dotEnv = require('dotenv');
dotEnv.config();
const jwt = require('jsonwebtoken');

const generateSecretRefreshToken = (body) => {
    const payload = {
        uuid: body.uuid,
        id: body.id,
        email: body.email,
    };
    const charset = process.env.REFRESH_TOKEN_SECRET;
    const token = jwt.sign(payload, charset, { expiresIn: '1y' });
    return token;
};

module.exports = generateSecretRefreshToken;
