const { validationResult } = require('express-validator');
const { failure, success } = require('../../common/response');
const authModel = require('../../model/auth');
const userModel = require('../../model/user');
const {
    hashPasswordUsingBcrypt,
    comparePasswords,
} = require('../../util/hashPassword');

class AuthController {
    async login(req, res) {
        //
        try {
            const { email, password } = req.body;
            const emailExists = await authModel
                .findOne({ email: email })
                .populate('user', '-password');
            if (!emailExists) {
                return res.status(400).json(failure('You are not registered'));
            } else {
                const passwordExists = await comparePasswords(
                    password,
                    emailExists?.password
                );
                if (!emailExists || !passwordExists) {
                    res.status(400).json(failure('Wrong email or password'));
                } else {
                    const data = {
                        _id: emailExists?._id,
                        email: emailExists?.email,
                        rank: emailExists?.rank,
                        name: emailExists?.user?.name,
                        address: emailExists?.user?.address,
                        phoneNumber: emailExists?.user?.phoneNumber,
                    };
                    res.status(200).json(success('Sign in successful', data));
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
                if (!emailExists) {
                    const newUser = await userModel.create({
                        email,
                        name,
                        phoneNumber,
                        address,
                    });
                    const hashedPassword =
                        await hashPasswordUsingBcrypt(password);
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
                    if (newRegistration) {
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
                            .json(failure('Something went wrong'));
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
}

module.exports = new AuthController();
