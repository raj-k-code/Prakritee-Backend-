const orderModel = require("../model/order.model");
const fast2sms = require("fast-two-sms");
const Gardener = require('../model/gardener.model');
const User = require('../model/user.model');
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const Product = require("../model/product.model");
const Email = require('../other/sendEmail');

var instance = new Razorpay({
    key_id: "rzp_test_2ZGv8MA0qkfdTz",
    key_secret: "sgWBJgIewU5cIMIXEGLPKR2g",
});

exports.order = (request, response) => {
    instance.orders.create({
        // amount: request.body.total + "00",
        amount: '1',

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
                                .then(async (user) => {
                                    //email sending
                                    // let transporter = nodemailer.createTransport({
                                    //     host: "smtp.gmail.com",
                                    //     port: 587,
                                    //     secure: false,
                                    //     requireTLS: true,
                                    //     auth: {
                                    //         user: "thegreenland.prakriti@gmail.com",
                                    //         pass: "prakriti@123",
                                    //     },
                                    // });

                                    // var message = {
                                    //     from: "thegreenland.prakriti@gmail.com",
                                    //     to: user.userEmail,
                                    //     subject: "Your Order Is Placed",
                                    //     html: `
                                    //    <h1>Order Will Be Deliver Soon</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                                    //  `
                                    // };

                                    // transporter.sendMail(message, (err, info) => {
                                    //     if (err) {
                                    //         console.log(err);
                                    //     } else {
                                    //         console.log(
                                    //             "SUCCESS===================================\n" + info
                                    //         );
                                    //     }
                                    // });

                                    var flag = await Email.sendMail(user.userEmail, "Your Order Is Placed", `<h1>Order Will Be Deliver Soon</h1>
                                       <p>Thanks for shopping with us.</p>
                                    `);

                                    //sms sending
                                    // var option = {
                                    //     authorization: "AqpRDdaVo8JnHEXKQGliyYvB0594L7WkjPcmxrIe2hC3g1MfTtZbRkCjvVMgJFeuO483zPcBaxYdXmKW",
                                    //     message: "Congratulations!!! your order is succesfully placed.....",
                                    //     numbers: [result.Mobile],
                                    // };
                                    // fast2sms.sendMessage(option);
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
                                .then(async (gardener) => {
                                    //email sending
                                    // let transporter = nodemailer.createTransport({
                                    //     host: "smtp.gmail.com",
                                    //     port: 587,
                                    //     secure: false,
                                    //     requireTLS: true,
                                    //     auth: {
                                    //         user: "thegreenland.prakriti@gmail.com",
                                    //         pass: "prakriti@123",
                                    //     },
                                    // });

                                    // var message = {
                                    //     from: "thegreenland.prakriti@gmail.com",
                                    //     to: gardener.gardenerEmail,
                                    //     subject: "Your Order Is Placed",
                                    //     html: `
                                    //    <h1>Order Will Be Deliver Soon</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                                    //  `
                                    // };

                                    // transporter.sendMail(message, (err, info) => {
                                    //     if (err) {
                                    //         console.log(err);
                                    //     } else {
                                    //         console.log(
                                    //             "SUCCESS===================================\n" + info
                                    //         );
                                    //     }
                                    // });

                                    var flag = await Email.sendMail(gardener.gardenerEmail, "Your Order Is Placed", `<h1>Order Will Be Deliver Soon</h1>
                                       <p>Thanks for shopping with us.</p>
                                    `);

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
            return response.redirect('https://prakritee-user.herokuapp.com/');
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


exports.historyByNursery = (request, response) => {
    orderModel
        .find()
        .populate("userId")
        .populate("productList.productId")
        .then((result) => {
            // console.log(result);
            if (result.length > 0) {
                console.log(result);

                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].productList.length; j++) {
                        if (result[i].productList[j].productId.createdBy != null) {
                            if (result[i].productList[j].productId.createdBy != request.body.nurseryId) {
                                result[i].productList.splice(j, 1);
                            }
                        }
                        else {
                            result[i].productList.splice(j, 1);
                        }


                    }

                    if (result[i].productList.length == 0) {
                        result.splice(i, 1);
                    }
                }


                return response.status(200).json(result);
            } else {
                return response.status(200).json({ message: "No Result Found" });
            }
        })
        .catch((err) => {
            console.log(err);
            return response
                .status(500)
                .json({ error: "Internal Server Error......." });
        });
}

exports.latestOrder = (request, response) => {
    var regx = new RegExp(request.body.status, 'i');

    orderModel
        .find({
            orderStatus: regx,
        })
        .populate("userId")
        .populate("productList.productId")
        .then((result) => {
            if (result.length > 0) {
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


exports.changeOrderStatus = (request, response) => {
    orderModel
        .updateOne({ _id: request.body.orderId }, {
            $set: {
                orderStatus: request.body.status
            }
        })
        .then((result) => {
            console.log(result);

            if (result.modifiedCount == 1) {
                return response.status(200).json({ success: "Changed Successfully" });
            } else {
                return response.status(200).json({ failed: "Not Changed" });
            }
        })
        .catch((err) => {
            console.log(err);
            return response
                .status(500)
                .json({ error: "Internal Server Error......." });
        });
};