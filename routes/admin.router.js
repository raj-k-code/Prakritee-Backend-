const express = require("express");
const { body } = require("express-validator");
const adminController = require("../controller/admin.controller");
const router = express.Router();

router.post('/signin',
    body("email").isEmail().notEmpty(),
    body("password").notEmpty().isLength(6),

    adminController.signin

);


module.exports = router;