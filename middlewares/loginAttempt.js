const { failure } = require('../common/response');
const authModel = require('../model/auth');
const LoginAttemptModel = require('../model/loginAttempt');
const { comparePasswords } = require('../util/hashPassword');

const checkUnsuccessfulLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let user = await LoginAttemptModel.findOne({ email });
        if (!user) {
            user = new LoginAttemptModel();
            user.email = email;
            user?.timestamp?.push(new Date());
            await user.save();
            console.log(user);
        } else {
            user.timestamp.push(new Date());
            await user.save();
            console.log(user?.timestamp);
            const earliestTimestamp = user?.timestamp[0];
            const latestTimestamp =
                user?.timestamp[user?.timestamp?.length - 1];
            const timeDifference = (latestTimestamp - earliestTimestamp) / 1000;

            if (timeDifference >= 20 && user?.timestamp?.length > 5) {
                const userAuth = await authModel.findOne({ email });
                const passwordExists = await comparePasswords(
                    password,
                    userAuth?.password
                );
                if (userAuth && passwordExists) {
                    user?.timestamp.splice(0, user?.timestamp?.length);
                    await user.save();
                    next();
                } else {
                    return res
                        .status(400)
                        .json(failure('Too many login attempts'));
                }
            } else {
                return res.status(400).json(failure('wrong Credentials'));
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send(failure('Internal Server Error'));
    }
};

module.exports = { checkUnsuccessfulLogin };
