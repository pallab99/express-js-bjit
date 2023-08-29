const dotEnv = require('dotenv');
dotEnv.config();
const generateSecretToken = () => {
    const charset = process.env.TOKEN_KEY;
    let token = '';

    for (let i = 0; i < 150; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        token += charset.charAt(randomIndex);
    }

    return token;
};

module.exports = generateSecretToken;
