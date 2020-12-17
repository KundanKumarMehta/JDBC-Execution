const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    //service: 'gmail',
    auth: {
        user: 'kkmehta.ss2020@gmail.com',
        pass: 'softsuave@123',
    },
    tls: {
        rejectUnauthorized: false
    }

});

module.exports = transport;