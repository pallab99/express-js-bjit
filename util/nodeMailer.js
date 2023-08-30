const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, verificationCode) => {
    console.log(email);
    let testAccount = await nodemailer.createTestAccount();
    const transporter = await nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'tanner61@ethereal.email',
            pass: 'daWCkYjHEdgJAmvSbX',
        },
    });
    const info = await transporter.sendMail({
        from: '"Pallab Majumdar 👻" <tanner61@ethereal.email>', // sender address
        to: `${email}`,
        subject: 'Signup verification ✔',
        text: `Thank you for the signing up.This is your verification code ${verificationCode}`,
    });
    // console.log(info);
};

module.exports = sendVerificationEmail;
