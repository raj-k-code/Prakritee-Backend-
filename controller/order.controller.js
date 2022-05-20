const orderModel = require("../model/order.model");
const fast2sms = require("fast-two-sms");
const Gardener = require('../model/gardener.model');
const User = require('../model/user.model');
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const Product = require("../model/product.model");

var instance = new Razorpay({
    key_id: "rzp_test_2ZGv8MA0qkfdTz",
    key_secret: "sgWBJgIewU5cIMIXEGLPKR2g",
});

exports.order = (request, response) => {
    instance.orders.create({
            amount: request.body.total + "00",
            currency: "INR",
        },
        (err, order) => {
            if (err) {
                console.log(err);
            } else {
                console.log(order);
                console.log(request.body);
                // response.json(order);


                orderModel
                    .create(request.body)
                    .then((result) => {
                        if (request.body.whose == 1) {
                            User.findOne({ _id: result.userId })
                                .then((user) => {
                                    //email sending
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
                                        to: user.userEmail,
                                        subject: "Your Order Is Placed",
                                        html: `
                                       <h1>Order Will Be Deliver Soon</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                                     `
                                    };

                                    transporter.sendMail(message, (err, info) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(
                                                "SUCCESS===================================\n" + info
                                            );
                                        }
                                    });

                                    //sms sending
                                    var option = {
                                        authorization: "AqpRDdaVo8JnHEXKQGliyYvB0594L7WkjPcmxrIe2hC3g1MfTtZbRkCjvVMgJFeuO483zPcBaxYdXmKW",
                                        message: "Congratulations!!! your order is succesfully placed.....",
                                        numbers: [result.Mobile],
                                    };
                                    fast2sms.sendMessage(option);
                                    console.log(result);
                                    return response
                                        .status(201)
                                        .json({ success: "Orderd Placed Successfully", data: order });
                                })
                                .catch((err) => {
                                    return response
                                        .status(201)
                                        .json({ failed: "Ordered Not Placed......." });
                                });
                        } else {
                            Gardener.findOne({ _id: result.userId })
                                .then((gardener) => {
                                    //email sending
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
                                        subject: "Your Order Is Placed",
                                        html: `
                                       <h1>Order Will Be Deliver Soon</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                                     `
                                    };

                                    transporter.sendMail(message, (err, info) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(
                                                "SUCCESS===================================\n" + info
                                            );
                                        }
                                    });

                                    //sms sending
                                    var option = {
                                        authorization: "AqpRDdaVo8JnHEXKQGliyYvB0594L7WkjPcmxrIe2hC3g1MfTtZbRkCjvVMgJFeuO483zPcBaxYdXmKW",
                                        message: "Congratulations!!! your order is succesfully placed.....",
                                        numbers: [result.Mobile],
                                    };
                                    fast2sms.sendMessage(option);

                                    return response
                                        .status(201)
                                        .json({ success: "Orderd Placed Successfully", data: order });
                                })
                                .catch((err) => {
                                    return response
                                        .status(201)
                                        .json({ failed: "Ordered Not Placed......." });
                                });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        return response
                            .status(201)
                            .json({ failed: "Internal server Error" });
                    });
            }
        }
    );
};

exports.orderStatus = (request, response) => {
    console.log(request.body);
    instance.payments
        .fetch(request.body.razorpay_payment_id)
        .then((resultDetails) => {
            // console.log(resultDetails);
            // response.send("payment success");
            return response.redirect('http://localhost:4200/');
        });
};

exports.viewOrder = (request, response) => {
    orderModel
        .find({
            userId: request.body.userId,
        })
        .populate("userId")
        .populate("productList.productId")
        .then((result) => {
            if (result) {
                return response.status(200).json(result);
            } else {
                return response.status(200).json({ message: "No Result Found" });
            }
        })
        .catch((err) => {
            return response
                .status(500)
                .json({ error: "Internal Server Error......." });
        });
};

exports.orderById = (request, response) => {
    orderModel
        .findOne({
            _id: request.params.id,
        })
        .populate("userId")
        .populate("productList.productId")
        .then((result) => {
            if (result) {
                return response.status(200).json(result);
            } else {
                return response.status(200).json({ message: "No Result Found" });
            }
        })
        .catch((err) => {
            return response
                .status(500)
                .json({ error: "Internal Server Error......." });
        });
};