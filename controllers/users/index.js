const path = require('path');
const fsPromise = require('fs').promises;
const { failure, success } = require('../../common/response');
const generateSecretToken = require('../../util/tokenGenerator');
const FileHandlerModel = require('../../model/filehandler');
const nodemailer = require('nodemailer');
const sendVerificationEmail = require('../../util/nodeMailer');
const userModel = require('../../model/user');
const { validationResult } = require('express-validator');

class Users {
    async signUpUser(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length) {
                const error = {};
                validation.forEach((ele) => {
                    const property = ele.path;
                    error[property] = ele.msg;
                });
                res.status(422).json(failure('Unprocessable Entity', error));
            } else {
                const { name, email, password } = req.body;
                const emailExists = await userModel.find({ email: email });
                console.log(emailExists);
                const nameExists = await userModel.find({ name: name });
                if (emailExists.length) {
                    return res
                        .status(400)
                        .json(failure('Email already exists'));
                } else if (nameExists.length) {
                    return res.status(400).json(failure('Name already exists'));
                }
                const result = await userModel.insertMany({
                    name,
                    email,
                    password,
                });
                if (result) {
                    res.status(200).json(success('SignIn successful', result));
                } else {
                    res.status(400).json(failure('Something went wrong'));
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async verifyCode(req, res) {
        try {
            const result = await FileHandlerModel.readFile(
                path.join(__dirname, '..', '..', 'data', 'users.json')
            );
            if (result.length) {
                const result = await FileHandlerModel.updateData(
                    path.join(__dirname, '..', '..', 'data', 'users.json'),
                    req,
                    res
                );
                console.log(result);
                if (result.success) {
                    res.status(200).json(success('Verification successful'));
                } else {
                    res.status(400).json(failure('Something Went wrong'));
                }
            }
        } catch (error) {
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async signInUser(req, res) {
        try {
            const { email, password } = req.body;
            const userData = await FileHandlerModel.readFile(
                path.join(__dirname, '..', '..', 'data', 'users.json')
            );
            const index = userData.findIndex(
                (ele) => ele.email === email && ele.password === password
            );
            const isVerified = userData[index].isVerified ? true : false;
            const filteredUser = userData.filter((ele) => {
                return ele.email === email && ele.password === password;
            });
            if (index != -1 && isVerified) {
                const token = generateSecretToken(req.body);
                userData[index].token = token;

                res.cookie('token', token, {
                    maxAge: 20 * 60 * 1000,
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
            } else if (index === -1) {
                res.status(400).json(failure('Wrong email or password'));
            } else if (!isVerified) {
                res.status(400).json(failure('You did not verified your code'));
            }
        } catch (error) {
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async signOutUser(req, res) {
        try {
            if (req.cookies.token != undefined) {
                res.clearCookie('token');
                res.status(200).json(success('Sign out successful'));
            } else {
                res.status(400).json(failure('Token Already Expired'));
            }
        } catch (error) {
            res.status(400).json(failure('Wrong email or password'));
        }
    }
}

module.exports = new Users();
