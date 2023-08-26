const path = require('path');
const { readFile, addDataToFile } = require('../../util/fileHandler');
const { failure, success } = require('../../common/response');
const validateUser = require('../../util/validateUserForSignup');

class Users {
    async signUpUser(req, res) {
        try {
            const validationResult = await validateUser(req);
            if (validationResult.success) {
                const result = await addDataToFile(
                    path.join(__dirname, '..', '..', 'data', 'users.json'),
                    req,
                    res
                );

                if (result.success) {
                    res.status(200).json(
                        success('Signup successful', result.data)
                    );
                } else {
                    res.status(400).json(failure('Signup failed'));
                }
            } else {
                res.status(400).json(
                    failure('Signup failed', validationResult.error)
                );
            }
        } catch (error) {
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = new Users();
