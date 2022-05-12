const express = require("express");
const router = express.Router();
const favController = require("../controller/fav.controller");

router.post("/add", favController.addTofav);

router.post("/view", favController.view);

router.post("/removeProduct", favController.removeProduct);

router.post("/delete", favController.delete);

module.exports = router;