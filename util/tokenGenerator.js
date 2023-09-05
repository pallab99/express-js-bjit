const dotEnv = require('dotenv');
dotEnv.config();
const jwt = require('jsonwebtoken');

const generateSecretToken = (body) => {
    console.log({ body });
    // delete body.exp;
    const charset = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(body, charset, { expiresIn: '20 s' });
    return token;
};

module.exports = generateSecretToken;
