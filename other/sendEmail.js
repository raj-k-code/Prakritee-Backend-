// const Sib = require('sib-api-v3-sdk')
// const client = Sib.ApiClient.instance;

// require('dotenv').config();

const nodemailer = require('nodemailer');


module.exports = class Email {
    constructor() { }

    // static sendMail(userEmail, subject, content) {
    //     return new Promise((resolve, reject) => {
    //         const apiKey = client.authentications['api-key'];
    //         // apiKey.apiKey = "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"
    //         apiKey.apiKey = process.env.API_KEY;

    //         const tranEmailApi = new Sib.TransactionalEmailsApi()
    //         const sender = {
    //             email: 'thegreenland.prakriti@gmail.com',
    //             name: 'Prakriti Admin',
    //         }
    //         const receivers = [
    //             {
    //                 email: userEmail,
    //             },
    //         ]

    //         tranEmailApi
    //             .sendTransacEmail({
    //                 sender,
    //                 to: receivers,
    //                 subject: subject,
    //                 // textContent: content,
    //                 htmlContent: content + `<br>
    //              <p>Have fun, and don't hesitate to contact us with your feedback</p><br><p> The Prakritee Team</p><a href="#">thegreenland.prakriti@gmail.com</a>`,
    //             })
    //             .then(result => {
    //                 // console.log(result);
    //                 resolve(true);
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 reject(false)
    //             })
    //     });
    // }

    static sendMail(userEmail, subject, content) {
        return new Promise((resolve, reject) => {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "thegreenland.prakriti@gmail.com",
                    pass: "trxitebjrdhfsomd",
                },
            });

            var message = {
                from: "thegreenland.prakriti@gmail.com",
                to: userEmail,
                subject: subject,
                html: content + `<br>
                  <p>Have fun, and don't hesitate to contact us with your feedback</p><br><p> The Prakritee Team</p><a href="#">thegreenland.prakriti@gmail.com</a>`
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log(err);
                    reject(false);
                } else {
                    console.log("SUCCESS=======\n" + info);
                    resolve(true);
                }
            });

        });
    }
}