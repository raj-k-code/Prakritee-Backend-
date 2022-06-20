const Query = require('../model/query.model');
const { validationResult } = require('express-validator');
const { request } = require('express');
const nodemailer = require('nodemailer');
const Email = require('../other/sendEmail');

exports.add = (request, response) => {
    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    Query.create(request.body)
        .then(result => {
            return response.status(200).json(result);
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error.." });
        });
}

exports.delete = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

    Query.deleteOne({ _id: request.body.queryId })
        .then(async result => {
            if (result.deletedCount == 1) {

                var flag = await Email.sendMail(request.body.email, "Query Is Rejected By Admin", `<p>Sorry Your Query Is Without Sense.</p>`);

                return response.status(201).json({ Delete: "Deleted Successfully" });
            } else
                return response.status(201).json({ notDelete: "Not Deleted " });

        })
        .catch(err => {
            return response.status(500).json({ error: "Internal Server Error......." });
        });
}

exports.queryList = (request, response) => {

    Query.find().populate('userId').populate('gardenerId').populate('nurseryId')
        .then(result => {
            if (result.length > 0)
                return response.status(200).json(result);
            else
                return response.status(401).json({ message: "Result Not Found..." });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error.." });
        });
}

exports.responseQuery = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

    var flag = await Email.sendMail(request.body.email, "Response On Your Query", request.body.message);
    if (flag) {
        return response.status(200).json({ failed: "Response Not Sent" });
    } else {
        Query.deleteOne({ _id: request.body.queryId })
            .then(result => {
                if (result.deletedCount == 1) {
                    return response.status(200).json({ success: "Response Sent" });
                } else
                    return response.status(201).json({ failed: "Deleted" });
            })
            .catch(err => {
                return response.status(500).json({ error: "Internal Server Error......." });
            });
    }
}