const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const productController = require('../controller/product.controller');
const firebase = require("../middleware/firebase.middleware");
const token = require("../middleware/token.middleware");

const multer = require("multer");
var storage = multer.diskStorage({
    destination: "public/images",
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

var upload = multer({ storage: storage });

router.post("/add-product", upload.single('productImage'),
    body('productName').notEmpty(),
    body('categoryName').notEmpty(),
    body('productPrice').isNumeric().notEmpty(),
    body('productDescription').notEmpty(),
    body('createdBy').notEmpty(),

    firebase.fireBaseStorage,
    productController.addProduct
);

module.exports = router;