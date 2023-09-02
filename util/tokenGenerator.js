const dotEnv = require('dotenv');
dotEnv.config();
const jwt = require('jsonwebtoken');

const generateSecretToken = (body) => {
    const payload = {
        id: body._id,
        email: body.email,
    };
    const charset = process.env.TOKEN_KEY;
    const token = jwt.sign(payload, charset);
    return token;
};

module.exports = generateSecretToken;
