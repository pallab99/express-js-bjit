const path = require('path');
const fsPromise = require('fs').promises;
const { readFile, addDataToFile } = require('../../util/fileHandler');
const { failure, success } = require('../../common/response');
const validateUser = require('../../util/validateUserForSignup');
const generateSecretToken = require('../../util/tokenGenerator');

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

    async signInUser(req, res) {
        try {
            // console.log(req.body);
            const { email, password } = req.body;
            const userData = await readFile(
                path.join(__dirname, '..', '..', 'data', 'users.json')
            );
            const index = userData.findIndex(
                (ele) => ele.email === email && ele.password === password
            );
            const filteredUser = userData.filter((ele) => {
                return ele.email === email && ele.password === password;
            });
            if (index != -1) {
                const token = generateSecretToken();
                userData[index].token = token;

                res.cookie('token', token, {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                });
                await fsPromise.writeFile(
                    path.join(__dirname, '..', '..', 'data', 'users.json'),
                    JSON.stringify(userData, 2, null)
                );
                res.status(200).json(
                    success('SignIn successful', filteredUser)
                );
            } else {
                res.status(400).json(failure('Wrong email or password'));
            }
        } catch (error) {
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = new Users();
