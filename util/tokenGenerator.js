const dotEnv = require('dotenv');
dotEnv.config();
const jwt = require('jsonwebtoken');

const generateSecretToken = (body) => {
    const payload = {
        uuid: body.uuid,
        id: body.id,
        email: body.email,
    };
    const charset = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(payload, charset, { expiresIn: '2 m' });
    return token;
};

module.exports = generateSecretToken;
