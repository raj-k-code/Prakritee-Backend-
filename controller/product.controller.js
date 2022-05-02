const Product = require("../model/product.model");
const { validationResult } = require("express-validator");
const requests = require("request");

exports.addProduct = (request, response) => {
        console.log(request.body)
        const error = validationResult(request);
        if (!error.isEmpty()) {
            return response.status(400).json({ errors: error.array() });
        }

        request.body.productImage = "https://firebasestorage.googleapis.com/v0/b/productdb-eaa0c.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba"

        Product.create(request.body)
            .then(result => {
                return response.status(500).json(result);
            })
            .catch(err => {
                console.log(err);
                return response.status(500).json({ error: "Internal server error.." });
            });
    }
    // Product.create({
    //         productName: request.body.productName,
    //         categoryName: request.body.categoryName,
    //         productPrice: request.body.productPrice,
    //         productDescription: request.body.productDescription,
    //         createdBy: request.body.createdBy,
    //         productImage: request.body.productImage
    //     })
    //     .then(result => {
    //         return response.status(201).json(result);
    //     })
    //     .catch(err => {
    //         return response.status(201).json({ error: "Internal Server Error......." });
    //     });