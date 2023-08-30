const dotEnv = require('dotenv');
dotEnv.config();
const jwt = require('jsonwebtoken');

const generateSecretToken = (body) => {
    const payload = {
        name: body.name,
        email: body.email,
    };
    const charset = process.env.TOKEN_KEY;
    const token = jwt.sign(payload, charset);
    return token;
};

module.exports = generateSecretToken;
