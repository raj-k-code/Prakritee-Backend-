const express = require("express");
const router = express.Router();
const cartController =require("../controller/cart.controller");
router.post("/add",cartController.addToCart);
router.post("/view",cartController.view);
router.post("/removeProduct",cartController.removeProduct);
router.post("/delete" , cartController.delete);

module.exports = router;