const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const productController = require('../controller/product.controller');
const firebase = require("../middleware/firebase.middleware");
const token = require("../middleware/token.middleware");

const multer = require("multer");
const { route } = require("./admin.router");
var storage = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
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

router.post("/delete-product", body('productId').notEmpty(), productController.delete)

router.get("/product-list", productController.productList);

router.post("/edit-product", upload.single('productImage'),
    body('productName').notEmpty(),
    body('categoryName').notEmpty(),
    body('productPrice').isNumeric().notEmpty(),
    body('productDescription').notEmpty(),
    body('productId').notEmpty(),
    body('oldImage').notEmpty(),
    firebase.fireBaseStorage,

    productController.edit);


router.post("/product-search", productController.searchProduct);

router.post("/product-list-similar", productController.productListSimilar);

router.get("/product-list-category/:name", productController.productListByCategory);

router.post("/product-list-by-nurseryowner", productController.productListByNurseryOwner);

router.get("/product-by-id/:productId", productController.productById);

router.post("/rate-the-product", productController.rateTheProduct);


module.exports = router;