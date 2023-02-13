
const dotenv = require('dotenv')

dotenv.config()

const sendGrid = require("@sendgrid/mail");

const sendEmail = async (email, verifyToken) => {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

    const verification = {
        from: '<micha199613@wp.pl>',
        to: email,
        subject: `Hello there ${new Date().toISOString()}`,
        text: `Hey, this is link to your verification : localhost:3000/api/users/verify/${verifyToken}`,
        html: `Hey, this is link to your verification : <a href="localhost:3000/api/users/verify/${verifyToken}">LINK</a></a>`,
    };

    await sendGrid.send(verification);
    return;
};



module.exports = { sendEmail };