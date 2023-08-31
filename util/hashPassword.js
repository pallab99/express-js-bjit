const bcrypt = require('bcrypt');

const hashPassword = async (plainPassword) => {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        return hash;
    } catch (err) {
        console.error('Error hashing password:', err);
    }
};

module.exports = hashPassword;
