const nodemailer = require('nodemailer');

const sendVerificationEmail = (data) => {
    console.log(data);
    const mailTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'baylee95@ethereal.email',
            pass: 'c1dCzt1crbyjKrG1Vc',
        },
    });

    const details = {
        from: 'baylee95@ethereal.email',
        to: data.email,
        subject: 'Email verification',
        text: `your verification code is .This code will expired after 2 minutes`,
    };
    mailTransporter.sendMail(details, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('email sent');
        }
    });
};

module.exports = sendVerificationEmail;
