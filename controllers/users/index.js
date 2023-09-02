const path = require('path');
const fsPromise = require('fs').promises;
const { failure, success } = require('../../common/response');
const generateSecretToken = require('../../util/tokenGenerator');
const FileHandlerModel = require('../../model/filehandler');
const nodemailer = require('nodemailer');
const sendVerificationEmail = require('../../util/nodeMailer');
const userModel = require('../../model/user');
const { validationResult } = require('express-validator');
const {
    hashPasswordUsingBcrypt,
    comparePasswords,
} = require('../../util/hashPassword');
const generateSecretRefreshToken = require('../../util/refreshTokenGenerator');
const jwt = require('jsonwebtoken');

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
                const nameExists = await userModel.find({ name: name });
                if (emailExists.length) {
                    return res
                        .status(400)
                        .json(failure('Email already exists'));
                } else if (nameExists.length) {
                    return res.status(400).json(failure('Name already exists'));
                }
                // const token = generateSecretToken(emailExists);
                const hashedPassword = await hashPasswordUsingBcrypt(password);

                const result = await userModel.insertMany({
                    name,
                    email,
                    password: hashedPassword,
                });
                if (result) {
                    res.status(200).json(success('SignIn successful', result));
                } else {
                    res.status(400).json(failure('Something went wrong'));
                }
            }
        } catch (error) {
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
            const emailExists = await userModel.findOne({ email: email });
            const passwordExists = await comparePasswords(
                password,
                emailExists.password
            );
            if (!emailExists || !passwordExists) {
                res.status(400).json(failure('Wrong email or password'));
            } else {
                const body = {
                    email: email,
                    name: emailExists.name,
                };
                const accessToken = generateSecretToken(emailExists);
                emailExists.accessToken = accessToken;
                const refreshToken = generateSecretRefreshToken(emailExists);
                emailExists.refreshToken.push(refreshToken);
                await emailExists.save();
                res.status(200).json(
                    success('Sign in successful', {
                        user: {
                            name: emailExists.name,
                            email: emailExists.email,
                        },
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    })
                );
            }
        } catch (error) {
            console.log(error);
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
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async refreshToken(req, res) {
        try {
            const { token } = req.body;
            const secretKey = process.env.REFRESH_TOKEN_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const { id } = decoded;
            const user = await userModel.findById(id);

            if (token == null)
                return res.status(401).json(failure('Token Cannot be Null'));
            if (!user?.refreshToken?.includes(token))
                return res
                    .status(401)
                    .json(failure('Invalid refresh token provided'));

            jwt.verify(token, secretKey, (err, user) => {
                if (err)
                    return res
                        .status(401)
                        .json(failure('Can not generate access token'));
                const accessToken = generateSecretToken(user);
                res.json(
                    success('Access Token generated successfully', {
                        accessToken: accessToken,
                    })
                );
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async logOut(req, res) {
        try {
            const { token } = req.body;
            const secretKey = process.env.REFRESH_TOKEN_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const { id } = decoded;
            const user = await userModel.findById(id);
            const { refreshToken } = user;
            const index = refreshToken.findIndex((ele) => ele === token);
            if (index != -1) {
                user.refreshToken.splice(index, 1);
                await user.save();
                res.status(200).json(success('Logout successfully'));
            } else {
                res.status(400).json(
                    failure('Invalid refresh token.You are already logged out')
                );
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = new Users();
