const { validationResult } = require('express-validator');
const { failure, success } = require('../../common/response');
const authModel = require('../../model/auth');
const userModel = require('../../model/user');
const {
    hashPasswordUsingBcrypt,
    comparePasswords,
} = require('../../util/hashPassword');
const generateSecretToken = require('../../util/tokenGenerator');
const generateSecretRefreshToken = require('../../util/refreshTokenGenerator');
const jwt = require('jsonwebtoken');

class AuthController {
    async login(req, res) {
        //
        try {
            const validation = validationResult(req).array();
            if (validation.length) {
                const error = {};
                validation.forEach((validationError) => {
                    const property = validationError.path;
                    error[property] = validationError.msg;
                });
                return res
                    .status(422)
                    .json(failure('Unprocessable Entity', error));
            } else {
                const { email, password } = req.body;
                const emailExists = await authModel
                    .findOne({ email: email })
                    .populate('user');
                if (!emailExists) {
                    return res
                        .status(400)
                        .json(failure('You are not registered'));
                } else {
                    const passwordExists = await comparePasswords(
                        password,
                        emailExists?.password
                    );

                    if (!passwordExists) {
                        return res
                            .status(400)
                            .json(failure('Wrong credentials'));
                    } else {
                        const data = {
                            _id: emailExists?._id,
                            email: emailExists?.email,
                            rank: emailExists?.rank,
                            name: emailExists?.user?.name,
                            address: emailExists?.user?.address,
                            phoneNumber: emailExists?.user?.phoneNumber,
                        };
                        const jwtToken = generateSecretToken(data);
                        const refreshToken = generateSecretRefreshToken(data);
                        data.accessToken = jwtToken;
                        data.refreshToken = refreshToken;
                        emailExists.sessionActive = true;
                        await emailExists.save();
                        // res.cookie('user-id', emailExists?._id, {
                        //     httpOnly: true,
                        // });
                        res.status(200).json(
                            success('Sign in successful', data)
                        );
                    }
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async signUp(req, res) {
        //
        try {
            const { email, password, rank, name, phoneNumber, address } =
                req.body;
            const validation = validationResult(req).array();
            if (validation.length) {
                const error = {};
                validation.forEach((ele) => {
                    const property = ele.path;
                    error[property] = ele.msg;
                });
                return res
                    .status(422)
                    .json(failure('Unprocessable Entity', error));
            } else {
                const emailExists = await authModel.findOne({ email: email });
                const emailExistsAtUser = await userModel.findOne({
                    email: email,
                });
                if (!emailExists && !emailExistsAtUser) {
                    const newUser = await userModel.create({
                        email,
                        name,
                        phoneNumber,
                        address,
                    });
                    const hashedPassword =
                        await hashPasswordUsingBcrypt(password);
                    if (newUser && hashedPassword) {
                        const newRegistration = await authModel.create({
                            email,
                            password: hashedPassword,
                            rank,
                            user: newUser._id,
                        });

                        const savedRegistration = await authModel
                            .findById(newRegistration._id)
                            .select('-password')
                            .exec();
                        if (newRegistration && savedRegistration) {
                            return res
                                .status(200)
                                .json(
                                    success(
                                        'Sign up successfully',
                                        savedRegistration
                                    )
                                );
                        } else {
                            return res
                                .status(400)
                                .json(
                                    failure(
                                        'Something went wrong.Please try again'
                                    )
                                );
                        }
                    } else {
                        return res
                            .status(400)
                            .json(
                                failure('Something went wrong.Please try again')
                            );
                    }
                } else {
                    return res
                        .status(400)
                        .json(failure('The email is already in use'));
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async logOut(req, res) {
        try {
            const id = req.cookies && req.cookies['user-id'];
            if (!id) {
                return res
                    .status(400)
                    .json(failure('You are already logged out'));
            } else {
                const user = await authModel.findById(id);
                if (user && user.sessionActive) {
                    user.sessionActive = false;
                    await user.save();
                    res.cookie('user-id', '', {
                        httpOnly: true,
                    });
                    return res
                        .status(200)
                        .json(success('Log out successfully', []));
                } else {
                    return res
                        .status(400)
                        .json(failure('You are already logged out'));
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async refreshToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token || token === undefined) {
                return res.status(401).json(failure('Token Cannot be Null'));
            }
            const secretKey = process.env.REFRESH_TOKEN_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const userData = {
                _id: decoded?._id,
                email: decoded?.email,
                rank: decoded?.rank,
                name: decoded?.name,
                address: decoded?.address,
                phoneNumber: decoded?.phoneNumber,
            };
            console.log({ userData });
            const refreshToken = await jwt.verify(token, secretKey);
            if (refreshToken) {
                const accessToken = generateSecretToken(userData);
                if (accessToken) {
                    res.status(200).json(
                        success('Access token generated.', accessToken)
                    );
                } else {
                    res.status(400).json(failure('Something went wrong'));
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = new AuthController();
