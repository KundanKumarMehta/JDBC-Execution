const transporter = require('../config/mail.config');

exports.mailDetails = async function (toReciever, sub, textMsg) {

    let mailOptions = await transporter.sendMail({
        from: 'kkmehta.ss2020@gmail.com',
        to: toReciever,
        subject: sub,
        html: textMsg,
    });
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            console.log('message not sent !' + error);
        else
            console.log('message sent successfully.......' + info.response);

    });
}
