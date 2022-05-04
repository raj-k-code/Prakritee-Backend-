const NurseryOwner = require("../model/nurseryowner.model");
const { validationResult } = require('express-validator');
const requests = require("request");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const crypto = require('crypto');

const key = "prakritee@123@05";
const algo = "aes-256-cbc"

exports.signup = (request, response) => {
    console.log(request.body);
    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    var cipher = crypto.createCipher(algo, key)
    var crypted = cipher.update(request.body.nurseryOwnerPassword, 'utf8', 'hex');
    crypted += cipher.final('hex');
    request.body.nurseryOwnerPassword = crypted;

    NurseryOwner.create(request.body)
        .then(result => {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "bidauction23@gmail.com",
                    pass: "brainforcode",
                },
            });

            var message = {
                from: "bidauction23@gmail.com",
                to: result.nurseryOwnerEmail,
                subject: "Confirm your account on Prakritee",
                html: '<p>you are a nice person for signing up with Prakritee! You must follow this link within 30 days of registration to activate your account:</p><a href= "http://localhost:3000/nurseryowner/verify-account/' + result._id + '">click here</a><p>Have fun, and dont hesitate to contact us with your feedback</p><br><p> The Prakritee Team</p><a href="#">Prakritee@gmail.com</a>',
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("SUCCESS===================================\n" + info);
                }
            });
            return response.status(201).json(result)
        }).catch(err => {
            return response.status(500).json({ message: "Internal Server Error..." })
        })
}

exports.signin = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    console.log(request.body)

    NurseryOwner.findOne({
        nurseryOwnerEmail: request.body.nurseryOwnerEmail,
        isVerify: true,
        isBlock: false
    }).then(result => {
        if (result) {
            var decipher = crypto.createDecipher(algo, key)
            var dec = decipher.update(result.nurseryOwnerPassword, 'hex', 'utf8')
            dec += decipher.final('utf8');

            if (dec == request.body.nurseryOwnerPassword) {
                let payload = { subject: result._id };
                let token = jwt.sign(payload, "giugifsyjhsadgjbjfbbdsfjbjbk");

                return response.status(201).json({ status: "login success", data: result, token: token })
            } else
                return response.status(201).json({ message: "Invalid Email And Password" })
        } else {
            return response.status(201).json({ failed: "login failed" })
        }
    }).catch(err => {
        return response.status(500).json({ error: "oops something went wrong" })
    })
}

exports.signinWithGoogle = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

    NurseryOwner.findOne({
        nurseryOwnerEmail: request.body.nurseryOwnerEmail,
        isVerify: true,
        isBlock: false
    }).then(result => {
        if (result) {
            let payload = { subject: result._id };
            let token = jwt.sign(payload, "giugifsyjhsadgjbjfbbdsfjbjbk");

            return response.status(201).json({ status: "login success", data: result, token: token })
        } else {
            console.log(result)
            return response.status(201).json({ failed: "login failed" })
        }
    }).catch(err => {
        return response.status(500).json({ error: "oops something went wrong" })
    })
}

exports.updateProfile = (request, response) => {

    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    request.body.Image = "https://firebasestorage.googleapis.com/v0/b/productdb-eaa0c.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba"

    NurseryOwner.updateOne({
            _id: request.body.nurseryownerId,
            isVerify: true,
            isBlock: false
        }, {
            $set: request.body
        })
        .then(result => {
            if (result.modifiedCount == 1)
                return response.status(201).json({ success: "Updated Successfolly" });
            else
                return response.status(201).json({ success: "Not Updated" });
        }).catch(err => {
            console.log(err);
            return response.status(500).json({ message: "Internal Server Error..." })
        })
}

exports.verifyAccountPage = (request, response) => {
    return response.status(200).render("verify-account.ejs", {
        apiUrl: "http://localhost:3000/nurseryowner/get-verified-account/" + request.params.id
    });
}

exports.getVerifiedAccount = (request, response) => {

    NurseryOwner.updateOne({ _id: request.params.id }, {
            $set: {
                isVerify: true
            }
        })
        .then(result => {
            if (result.modifiedCount == 1)
                return response.status(200).render("success-page.ejs");
            else
                return response.status(201).json({ failed: "Something went wrong" });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal Server Error..." })
        });

}

exports.forgotPassword = (request, response) => {
    NurseryOwner.findOne({
        nurseryOwnerEmail: request.body.nurseryOwnerEmail
    }).then(result => {
        console.log(result);
        if (result) {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "bidauction23@gmail.com",
                    pass: "brainforcode",
                },
            });

            var message = {
                from: "bidauction23@gmail.com",
                to: result.nurseryOwnerEmail,
                subject: "Message Form Prakritee",
                html: `
                 <p>Your old password is here 👇🏻</p>
                 <br>
                 <h3>PASSWORD: ` + result.nurseryOwnerPassword + `</h3>
                 <br>
                 <p>Have fun, and dont hesitate to contact us with your feedback</p><br><p> The Prakritee Team</p><a href="#">Prakritee@gmail.com</a>
                 `
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("SUCCESS===================================\n" + info);
                }
            });
            return response.status(200).json({ success: "check your email", result: result });
        } else {
            return response.status(200).json({ message: "No User Found With This Email Address" })
        }
    }).catch(err => {
        return response.status(500).json({ error: "oops something went wrong" })
    })
}

exports.nurseryList = (request, response) => {
    NurseryOwner.find({
        isVerify: true,
        isBlock: false
    }).then(result => {
        if (result.length > 0) {
            return response.status(201).json(result)
        } else {
            console.log(result)
            return response.status(201).json({ message: "Result Not Found" })
        }
    }).catch(err => {
        return response.status(500).json({ error: "oops something went wrong" })
    })
}


exports.blockNursery = (request, response) => {
    NurseryOwner.updateOne({ _id: request.body.nurseryownerId }, {
            $set: {
                isBlock: true
            }
        })
        .then(result => {
            if (result.modifiedCount == 1) {
                NurseryOwner.findOne({ _id: request.body.nurseryownerId }).then(nurseryowner => {
                    if (nurseryowner) {
                        let transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: 587,
                            secure: false,
                            requireTLS: true,
                            auth: {
                                user: "bidauction23@gmail.com",
                                pass: "brainforcode",
                            },
                        });

                        var message = {
                            from: "bidauction23@gmail.com",
                            to: nurseryowner.nurseryOwnerEmail,
                            subject: "🚨 Alert From Prakritee 🚨",
                            html: '<p>Your account is blocked by the Prakritee Admin</p><br><p> The Prakritee Team</p><a href="#">Prakritee@gmail.com</a>',
                        };

                        transporter.sendMail(message, (err, info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("SUCCESS===================================\n" + info);
                            }
                        });

                        return response.status(201).json({ success: "Successfully Blocked Nursery Owner" });
                    } else
                        return response.status(201).json({ message: "Blocked But Notification Not Sent.." });


                }).catch(err => {
                    return response.status(500).json({ error: "oops something went wrong" })
                })
            } else
                return response.status(201).json({ message: "Not Blocked.." });
        })
        .catch(err => {
            return response.status(500).json({ error: "oops something went wrong" })
        });
}

exports.unBlockNursery = (request, response) => {
    NurseryOwner.updateOne({ _id: request.body.nurseryownerId }, {
            $set: {
                isBlock: false
            }
        })
        .then(result => {
            if (result.modifiedCount == 1) {
                NurseryOwner.findOne({ _id: request.body.nurseryownerId }).then(nurseryowner => {
                    if (nurseryowner) {
                        let transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: 587,
                            secure: false,
                            requireTLS: true,
                            auth: {
                                user: "bidauction23@gmail.com",
                                pass: "brainforcode",
                            },
                        });

                        var message = {
                            from: "bidauction23@gmail.com",
                            to: nurseryowner.nurseryOwnerEmail,
                            subject: "🎉 Alert From Prakritee 🎉",
                            html: '<p>Your account is Unblocked by the Prakritee Admin. Now you can signin in Prakritee.com</p><br><p> The Prakritee Team</p><a href="#">Prakritee@gmail.com</a>',
                        };

                        transporter.sendMail(message, (err, info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("SUCCESS===================================\n" + info);
                            }
                        });

                        return response.status(200).json({ success: "Successfully Unblocked Nursery Owner" });
                    } else
                        return response.status(201).json({ message: "Unblocked But Notification Not Sent.." });


                }).catch(err => {
                    return response.status(500).json({ error: "oops something went wrong" })
                })
            } else
                return response.status(201).json({ message: "Not Unblocked.." });
        })
        .catch(err => {
            return response.status(500).json({ error: "oops something went wrong" })
        });
}