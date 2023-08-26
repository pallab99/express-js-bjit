const generateSecretToken = () => {
    const charset =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        token += charset.charAt(randomIndex);
    }

    return token;
};

module.exports = generateSecretToken;
