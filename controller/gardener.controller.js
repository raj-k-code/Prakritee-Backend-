const Gardener = require("../model/gardener.model");
const { validationResult } = require('express-validator');
const requests = require("request");
const Category = require("../model/category.model");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const alert = require('alert');
const { response } = require("express");
const crypto = require('crypto');
const Booking = require('../model/booking.model');
const User = require('../model/user.model');
const Email = require('../other/sendEmail');

const key = "prakritee@123@05";
const algo = "aes-256-cbc"

exports.signup = (request, response) => {
    console.log(request.body);

    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    var cipher = crypto.createCipher(algo, key)
    var crypted = cipher.update(request.body.gardenerPassword, 'utf8', 'hex');
    crypted += cipher.final('hex');
    request.body.gardenerPassword = crypted;

    delete request.body.gardenerImage;

    Gardener.create(request.body)
        .then(async result => {

            var flag = await Email.sendMail(result.gardenerEmail, "Verify Your Gmail Account", `<p>you are a nice person for signing up with Prakritee! You must follow this link within 30 days of registration to activate your account:</p><a href= "https://prakritee.herokuapp.com/gardener/verify-account/` + result._id + `">click here</a>`);

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

    Gardener.findOne({
        gardenerEmail: request.body.gardenerEmail,
        isVerify: true,
        isBlock: false
    }).then(result => {
        if (result) {
            var decipher = crypto.createDecipher(algo, key)
            var dec = decipher.update(result.gardenerPassword, 'hex', 'utf8')
            dec += decipher.final('utf8');

            if (dec == request.body.gardenerPassword) {
                let payload = { subject: result._id };
                let token = jwt.sign(payload, "giugifsyjhsadgjbjfbbdsfjbjbk");

                return response.status(201).json({ status: "login success", data: result, token: token })
            } else
                return response.status(401).json({ message: "Invalid Email And Password" })
        } else {
            return response.status(401).json({ failed: "login failed" })
        }
    }).catch(err => {
        return response.status(500).json({ error: "oops something went wrong" })
    })
}

exports.signinWithGoogle = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

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
            return response.status(201).json({ failed: "login failed" })
        }
    }).catch(err => {
        return response.status(500).json({ error: "oops something went wrong" })
    })
}

exports.updateProfile = (request, response) => {
    console.log(request.file)
    console.log(request.body);

    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }
    if (request.file)
        request.body.gardenerImage = "https://firebasestorage.googleapis.com/v0/b/prakriti-3d8ad.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba"

    console.log(request.body.gardenerImage + "=======================")

    Gardener.updateOne({
        _id: request.body.gardenerId,
        isVerify: true,
        isBlock: false
    }, {
        $set: request.body
    })
        .then(result => {
            if (result.modifiedCount == 1)
                return response.status(201).json({ success: "Updated Successfolly" });
            else
                return response.status(201).json({ failed: "Not Updated" });
        }).catch(err => {
            return response.status(500).json({ message: "Internal Server Error..." })
        })
}

exports.verifyAccountPage = (request, response) => {
    return response.status(200).render("verify-account.ejs", {
        apiUrl: "https://prakritee.herokuapp.com/gardener/get-verified-account/" + request.params.id
    });
}

exports.getVerifiedAccount = (request, response) => {

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
}

exports.forgotPassword = (request, response) => {
    Gardener.findOne({
        gardenerEmail: request.body.gardenerEmail
    }).then(async result => {
        if (result) {
            var decipher = crypto.createDecipher(algo, key)
            var dec = decipher.update(result.gardenerPassword, 'hex', 'utf8')
            dec += decipher.final('utf8');
            result.gardenerPassword = dec;

            var flag = await Email.sendMail(result.gardenerEmail, "Forgot Password", `
                 <p>Your old password is here 👇🏻</p>
                 <br>
                 <h3>PASSWORD: ` + result.gardenerPassword + `</h3>
                 `);

            if (flag)
                return response.status(200).json({ success: "check your email", result: result });
            else
                return response.status(200).json({ message: "Please try again later" })
        } else {
            return response.status(200).json({ message: "No User Found With This Email Address" })
        }
    }).catch(err => {
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
            return response.status(201).json({ message: "Result Not Found" })
        }
    }).catch(err => {
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
                Gardener.findOne({ _id: request.body.gardenerId }).then(async gardener => {
                    if (gardener) {

                        var flag = await Email.sendMail(gardener.gardenerEmail, "🚨 Alert From Prakritee 🚨", `<p>Your account is blocked by the Prakritee Admin.If you have any objection then contact with admin.</p>`);
                        if (flag)
                            return response.status(200).json({ success: "Successfully Blocked Gardener" });
                        else
                            return response.status(201).json({ message: "Blocked But Notification Not Sent.." });
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
                Gardener.findOne({ _id: request.body.gardenerId }).then(async gardener => {
                    if (gardener) {

                        var flag = await Email.sendMail(gardener.gardenerEmail, "🎉 Alert From Prakritee 🎉", `<p>Your account is Unblocked by the Prakritee Admin. Now you can signin in Prakritee.com</p>`);
                        if (flag)
                            return response.status(200).json({ success: "Successfully Unblocked Gardener" });
                        else
                            return response.status(201).json({ message: "Unblocked But Notification Not Sent.." });
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

exports.rateTheGardener = async (request, response) => {

    let gardener = await Gardener.findOne({ _id: request.body.gardenerId })

    if (!gardener) {
        return response.status(200).json({ message: "This Gardener Dosen't Exist Now" })
    }
    let flag = false;

    for (let item of gardener.gardenerRating) {
        if (item.userId == request.body.userId) {
            let update = await Gardener.updateOne({
                _id: request.body.gardenerId,
                "gardenerRating.userId": request.body.userId,
            }, { $set: { "gardenerRating.$.rate": request.body.rate, "gardenerRating.$.review": request.body.review } });

            if (update.modifiedCount == 1) {
                flag = true;
                return response.status(200).json({ success: "Success" });
            } else {
                return response.status(200).json({ failed: "Not Success" });
            }
        }
    }
    if (!flag) {
        gardener.gardenerRating.push({
            userId: request.body.userId,
            rate: request.body.rate,
            review: request.body.review
        });
        gardener.save().then(result => {
            if (result)
                return response.status(200).json({ data: result, success: "Rated Successfully" })
            else
                return response.status(200).json({ data: result, failed: "Not Rated Successfully" })
        }).catch(err => {
            return response.status(500).json({ error: "oops something went wrong" })
        })
    }

}

exports.bookTheGardener = async (request, response) => {
    let booking = await Booking.findOne({ gardenerId: request.body.gardenerId });
    console.log(request.body.query);

    if (booking) {
        for (i in booking.bookRequests) {

            if (request.body.userId) {
                if (booking.bookRequests[i].userId == request.body.userId)
                    return response.status(200).json({ message: 'Already Requested This Gardener' });
            }
            else {
                if (booking.bookRequests[i].nurseryId == request.body.nurseryId)
                    return response.status(200).json({ message: 'Already Requested This Gardener' });
            }
        }

        if (request.body.nurseryId) {
            await booking.bookRequests.push({ query: request.body.query, nurseryId: request.body.nurseryId });
            console.log("Inside if");
        }
        else {
            await booking.bookRequests.push({ query: request.body.query, userId: request.body.userId });
            console.log("Inside else....")

        }
        booking.save()
            .then(result => {
                console.log(result);

                Gardener.findOne({ _id: request.body.gardenerId }).then(async gardener => {
                    if (gardener) {

                        var flag = await Email.sendMail(gardener.gardenerEmail, "🎉 New Request 🎉", `<p>We Have Find A New Work Opportunity For You.Please Go To Our Website to Responsed</p>`);
                        if (flag)
                            return response.status(200).json({ success: "Request Sent" });
                        else
                            return response.status(201).json({ failed: "Request Sent But Notification didin't" });
                    } else
                        return response.status(201).json({ failed: "Request Sent But Notification didin't" });
                }).catch(err => {
                    return response.status(500).json({ error: "oops something went wrong" })
                })
            })
            .catch(err => {
                console.log(err);
                return response.status(500).json({ error: 'Internal Server Error' });
            });
    } else {

        let newBooking = await new Booking();
        newBooking.gardenerId = await request.body.gardenerId;

        if (request.body.nurseryId)
            await newBooking.bookRequests.push({ query: request.body.query, nurseryId: request.body.nurseryId });
        else
            await newBooking.bookRequests.push({ query: request.body.query, userId: request.body.userId });

        newBooking.save()
            .then(result => {
                console.log(result);

                Gardener.findOne({ _id: request.body.gardenerId }).then(async gardener => {
                    if (gardener) {

                        var flag = await Email.sendMail(gardener.gardenerEmail, "🎉 New Request 🎉", `<p>We Have Find A New Work Opportunity For You.Please Go To Our Website to Responsed</p>`);
                        if (flag)
                            return response.status(200).json({ success: "Request Sent" });
                        else
                            return response.status(201).json({ failed: "Request Sent But Notification didin't" });
                    } else
                        return response.status(201).json({ failed: "Request Sent But Notification didin't" });


                }).catch(err => {
                    return response.status(500).json({ error: "oops something went wrong" })
                })
            })
            .catch(err => {
                console.log(err);
                return response.status(500).json({ error: 'Internal Server Error' });
            });
    }
}

exports.alreadyExist = async (request, response) => {
    var data;

    if (request.body.nurseryId) {
        data = await Booking.findOne({ gardenerId: request.body.gardenerId, 'bookRequests.nurseryId': request.body.nurseryId });
    }
    else {
        data = await Booking.findOne({ gardenerId: request.body.gardenerId, 'bookRequests.userId': request.body.userId });
    }

    console.log(data)

    if (data) {
        return response.status(200).json({ exist: true });
    }
    else {
        return response.status(200).json({ exist: false });
    }

}

exports.approveRequest = async (request, response) => {
    console.log(request.body);
    var update;
    Booking.findOne({ gardenerId: request.body.gardenerId })
        .then(async (result) => {
            if (result) {

                for (let req of result.bookRequests) {
                    if (req.userId == request.body.userId) {
                        console.log("inside If===============")
                        update = await Booking.updateOne({ gardenerId: request.body.gardenerId, "bookRequests.userId": request.body.userId }, {
                            $set: {
                                "bookRequests.$.isApproved": true
                            }
                        });
                    } else if (req.nurseryId == request.body.nurseryId) {
                        console.log("inside else===============")

                        update = await Booking.updateOne({ gardenerId: request.body.gardenerId, "bookRequests.nurseryId": request.body.nurseryId }, {
                            $set: {
                                "bookRequests.$.isApproved": true
                            }
                        });
                    }
                }
                console.log(update.modifiedCount)
                if (update.modifiedCount == 1) {

                    var flag = await Email.sendMail(request.body.email, "🎉 Approval 🎉", `<p>Your request is approved by the Gardener.Please go to our website to contact him quickly</p>`);
                    if (flag)
                        return response.status(200).json({ success: "Response Sent" });
                    else
                        return response.status(200).json({ failed: "updated but email not sent." });

                } else {
                    return response.status(200).json({ failed: "Record Not Found" });
                }

            } else {
                return response.status(200).json({ failed: "Record Not Found" });
            }
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ error: "Internal Server Error" });
        });
}

exports.completeRequest = (request, response) => {
    console.log(request.body);
    var update;
    Booking.findOne({ gardenerId: request.body.gardenerId })
        .then(async (result) => {
            if (result) {
                for (let req of result.bookRequests) {
                    if (req.userId == request.body.userId) {
                        console.log("inside If===============")
                        update = await Booking.updateOne({ gardenerId: request.body.gardenerId, "bookRequests.userId": request.body.userId }, {
                            $set: {
                                "bookRequests.$.isDone": true
                            }
                        });
                    } else if (req.nurseryId == request.body.nurseryId) {
                        console.log("inside else===============")

                        update = await Booking.updateOne({ gardenerId: request.body.gardenerId, "bookRequests.nurseryId": request.body.nurseryId }, {
                            $set: {
                                "bookRequests.$.isDone": true
                            }
                        });
                    }
                }
                console.log(update.modifiedCount)
                if (update.modifiedCount == 1) {
                    return response.status(200).json({ success: "Response Sent update-else" });
                } else {
                    return response.status(200).json({ failed: "Record Not Found result else" });
                }

            } else {
                return response.status(200).json({ failed: "Record Not Found" });
            }
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ error: "Internal Server Error" });
        });
}

exports.cancelRequest = async (request, response) => {
    var update;
    if (request.body.userId)
        update = await Booking.updateOne({ gardenerId: request.body.gardenerId }, { $pull: { "bookRequests": { userId: request.body.userId } } }, { safe: true, multi: false });
    else
        update = await Booking.updateOne({ gardenerId: request.body.gardenerId }, { $pull: { "bookRequests": { nurseryId: request.body.nurseryId } } }, { safe: true, multi: false });

    if (update.modifiedCount == 1) {

        var flag = await Email.sendMail(request.body.email, " Rejected 🎉", `<p>Your request is rejected by the Gardener.Please go to our website to see more gardeners</p>`);
        if (flag)
            return response.status(200).json({ success: "Response Sent" });
        else
            return response.status(200).json({ failed: "updated but email not sent." });
    } else
        return response.status(201).json({ failed: "Didn't Rejected" });
}

exports.viewRequest = (request, response) => {
    Booking.findOne({ gardenerId: request.body.gardenerId }).sort({ _id: -1 }).populate('bookRequests.userId').populate('bookRequests.nurseryId').populate('gardenerId').then(result => {
        if (result) {
            return response.status(201).json(result)
        } else {
            return response.status(201).json({ message: "Result Not Found" })
        }
    }).catch(err => {
        return response.status(500).json({ error: "oops something went wrong" })
    })
}

exports.viewAllRequest = (request, response) => {
    Booking.find().populate('bookRequests.userId').populate('bookRequests.nurseryId').populate('gardenerId').then(result => {
        if (result) {
            return response.status(201).json(result)
        } else {
            return response.status(201).json({ message: "Result Not Found" })
        }
    }).catch(err => {
        return response.status(500).json({ error: "oops something went wrong" })
    })
}


exports.gardenerById = (request, response) => {
    Gardener
        .findOne({ _id: request.params.gardenerId }).populate('gardenerRating.userId')
        .then(result => {
            if (result) {
                return response.status(200).json(result);
            } else {
                return response.status(200).json({ message: "No Result Found" });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "something went wrong" });
        });
};


exports.checkEmail = (request, response) => {
    Gardener
        .findOne({ gardenerEmail: request.params.gardenerEmail })
        .then(result => {
            if (result) {
                return response.status(200).json({ exist: true });
            } else {
                return response.status(200).json({ exist: false });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "something went wrong" });
        });
}

exports.checkMobile = (request, response) => {
    Gardener
        .findOne({ gardenerMobile: request.params.gardenerMobile })
        .then(result => {
            if (result) {
                return response.status(200).json({ exist: true });
            } else {
                return response.status(200).json({ exist: false });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "something went wrong" });
        });
}