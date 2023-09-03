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
const { v4: uuidv4 } = require('uuid');
const setTokenToCookie = require('../../util/setTokenToCookie');
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
                const hashedPassword = await hashPasswordUsingBcrypt(password);

                const result = await userModel.insertMany({
                    uuid: uuidv4(),
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
            if (emailExists.isValidSession) {
                return res
                    .status(400)
                    .json(failure('You are already signed in'));
            }
            if (!emailExists || !passwordExists) {
                res.status(400).json(failure('Wrong email or password'));
            } else {
                const body = {
                    uuid: emailExists.uuid,
                    id: emailExists._id,
                    email: emailExists.email,
                };
                const accessToken = generateSecretToken(body);
                const refreshToken = generateSecretRefreshToken(body);
                emailExists.isValidSession = true;
                await emailExists.save();

                setTokenToCookie(res, {
                    name: 'accessToken',
                    value: accessToken,
                    maxAge: 300000,
                });
                setTokenToCookie(res, {
                    name: 'refreshToken',
                    value: refreshToken,
                    maxAge: 3.154e10,
                });

                res.status(200).json(
                    success('Sign in successful', {
                        user: {
                            _id: emailExists._id,
                            name: emailExists.name,
                            email: emailExists.email,
                            isValidSession: emailExists.isValidSession,
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
            const token = req.headers.authorization?.split(' ')[1];
            if (token?.length === 0 || !token || token === undefined) {
                return res.status(401).json(failure('Token Cannot be Null'));
            }
            const secretKey = process.env.REFRESH_TOKEN_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const { id } = decoded;
            const user = await userModel.findById(id);

            jwt.verify(token, secretKey, (err, user) => {
                if (err) {
                    return res
                        .status(401)
                        .json(failure('Invalid token provided.'));
                } else {
                    const accessToken = generateSecretToken(user);

                    setTokenToCookie(res, {
                        name: 'accessToken',
                        value: accessToken,
                        maxAge: 300000,
                    });
                    setTokenToCookie(res, {
                        name: 'refreshToken',
                        value: token,
                        maxAge: 3.154e10,
                    });

                    return res.json(
                        success('Access Token generated successfully', {
                            accessToken: accessToken,
                        })
                    );
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }
    async logOut(req, res) {
        try {
            if (Object.keys(req.cookies).length === 0) {
                return res
                    .status(403)
                    .json(failure('You are already logged out'));
            } else {
                const accessToken = req.cookies.accessToken;
                const secretKey = process.env.ACCESS_TOKEN_SECRET;

                try {
                    const decoded = jwt.verify(accessToken, secretKey);
                    const { id } = decoded;
                    console.log(id);
                    const user = await userModel.findById(id);
                    user.isValidSession = false;
                    await user.save();

                    setTokenToCookie(res, {
                        name: 'accessToken',
                        value: '',
                        maxAge: 0,
                    });
                    setTokenToCookie(res, {
                        name: 'refreshToken',
                        value: '',
                        maxAge: 0,
                    });
                    res.status(200).json(success('Log out successful'));
                } catch (tokenError) {
                    if (tokenError instanceof jwt.TokenExpiredError) {
                        return res
                            .status(401)
                            .json(failure('Token has expired'));
                    } else {
                        console.error(tokenError);
                        return res
                            .status(500)
                            .json(failure('Internal Server Error'));
                    }
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = new Users();
