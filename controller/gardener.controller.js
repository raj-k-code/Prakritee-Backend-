const Gardener = require("../model/gardener.model");
const { validationResult } = require('express-validator');
const requests = require("request");
const Category = require("../model/category.model");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const alert = require('alert');
const { response } = require("express");

exports.signup = (request, response) => {
    console.log(request.body);
    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    Gardener.create(request.body)
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
                to: result.gardenerEmail,
                subject: "Confirm your account on Prakritee",
                html: '<p>you are a nice person for signing up with Prakritee! You must follow this link within 30 days of registration to activate your account:</p><a href= "http://localhost:3000/gardener/verify-account/' + result._id + '">click here</a><p>Have fun, and dont hesitate to contact us with your feedback</p><br><p> The Prakritee Team</p><a href="#">Prakritee@gmail.com</a>',
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("SUCCESS===================================\n" + info);
                }
            });
            console.log(result)
            return response.status(201).json(result)
        }).catch(err => {
            console.log(err);
            return response.status(500).json({ message: "Internal Server Error..." })
        })
}

exports.signin = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    console.log(request.body)

    Gardener.findOne({
        gardenerEmail: request.body.gardenerEmail,
        gardenerPassword: request.body.gardenerPassword,
        isVerify: true,
        isBlock: false
    }).then(result => {
        if (result) {
            let payload = { subject: result._id };
            let token = jwt.sign(payload, "giugifsyjhsadgjbjfbbdsfjbjbk");

            return response.status(201).json({ status: "login success", data: result, token: token })
        } else {
            console.log(result)
            return response.status(500).json({ failed: "login failed" })
        }
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: "oops something went wrong" })
    })
}

exports.signinWithGoogle = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    console.log(request.body)

    Gardener.findOne({
        gardenerEmail: request.body.gardenerEmail,
        isVerify: true,
        isBlock: false
    }).then(result => {
        if (result) {
            let payload = { subject: result._id };
            let token = jwt.sign(payload, "giugifsyjhsadgjbjfbbdsfjbjbk");

            return response.status(201).json({ status: "login success", data: result, token: token })
        } else {
            console.log(result)
            return response.status(500).json({ failed: "login failed" })
        }
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: "oops something went wrong" })
    })
}

exports.updateProfile = (request, response) => {
    console.log(request.body);
    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    request.body.gardenerImage = "https://firebasestorage.googleapis.com/v0/b/productdb-eaa0c.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba"

    Gardener.updateOne({
            _id: request.body.gardenerId,
            isVerify: true,
            isBlock: false
        }, {
            $set: request.body
        })
        .then(result => {
            console.log(result)
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
        // gardenerId: request.params.id,
        apiUrl: "http://localhost:3000/gardener/get-verified-account/" + request.params.id
    });
    // return response.status(200).send(alert("Congratulations your account is verified now you can login"))
}

exports.getVerifiedAccount = (request, response) => {
    console.log(request.params.id)

    Gardener.updateOne({ _id: request.params.id }, {
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

    // return response.status(200).send(alert("Congratulations your account is verified now you can login"))
}

exports.forgotPassword = (request, response) => {
    Gardener.findOne({
        gardenerEmail: request.body.gardenerEmail
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
                to: result.gardenerEmail,
                subject: "Message Form Prakritee",
                html: `
                 <p>Your old password is here 👇🏻</p>
                 <br>
                 <h3>PASSWORD: ` + result.gardenerPassword + `</h3>
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
        console.log(err);
        return response.status(500).json({ error: "oops something went wrong" })
    })
}

exports.gardenerList = (request, response) => {
    Gardener.find({
        isVerify: true,
        isBlock: false
    }).then(result => {
        if (result.length > 0) {
            return response.status(201).json(result)
        } else {
            console.log(result)
            return response.status(500).json({ message: "Result Not Found" })
        }
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: "oops something went wrong" })
    })
}


exports.blockGardener = (request, response) => {
    Gardener.updateOne({ _id: request.body.gardenerId }, {
            $set: {
                isBlock: true
            }
        })
        .then(result => {
            if (result.modifiedCount == 1) {
                Gardener.findOne({ _id: request.body.gardenerId }).then(gardener => {
                    if (gardener) {
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
                            to: gardener.gardenerEmail,
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

                        return response.status(200).json({ success: "Successfully Blocked Gardener" });
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

exports.unBlockGardener = (request, response) => {
    Gardener.updateOne({ _id: request.body.gardenerId }, {
            $set: {
                isBlock: false
            }
        })
        .then(result => {
            if (result.modifiedCount == 1) {
                Gardener.findOne({ _id: request.body.gardenerId }).then(gardener => {
                    if (gardener) {
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
                            to: gardener.gardenerEmail,
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

                        return response.status(200).json({ success: "Successfully Unblocked Gardener" });
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