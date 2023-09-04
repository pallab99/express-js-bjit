const { validationResult } = require('express-validator');
const { failure, success } = require('../../common/response');

class AuthController {
    async login(req, res) {
        //
    }

    async signUp(req, res) {
        //
        try {
            const { email, password, rank, name, phoneNumber, address } =
                req.body;
            // console.log(email, password, rank, name, phoneNumber, address);
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
                return res.status(200).json(success('Success Entity'));
            }
        } catch (error) {
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = new AuthController();
