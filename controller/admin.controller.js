const { response } = require("express");
const Admin = require("../model/admin.model");
const { validationResult } = require('express-validator');

exports.signin = (request, response) => {
    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(400).json({ errors: error.array() });
    }

    Admin.findOne(request.body)
        .then(result => {
            if (result)
                return response.status(500).json(result);
            else
                return response.status(500).json({ message: "Login Failed..." });
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ error: "Internal server error.." });
        });
}