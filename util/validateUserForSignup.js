const { readFile } = require('./fileHandler');
const path = require('path');
const validateUser = async (req) => {
    const { name, email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const userData = await readFile(
        path.join(__dirname, '..', 'data', 'users.json')
    );
    const error = {};
    if (!name || !name.length) {
        error.name = 'Name is Required';
    }
    if (!email || !emailRegex.test(email)) {
        error.email = 'Invalid email';
    }
    if (!password || !password.length || password.length < 8) {
        error.password = 'Password must be 8 characters long';
    }
    const isSameName = userData.findIndex((ele) => {
        return ele.name === name;
    });
    const isSameEmail = userData.findIndex((ele) => {
        return ele.email === email;
    });
    if (isSameName != -1) {
        error.name = 'Name is already taken';
    }
    if (isSameEmail != -1) {
        error.email = 'Email is already taken';
    }
    return { success: Object.keys(error).length === 0, error: error };
};

module.exports = validateUser;
