const express = require("express");
const { body } = require("express-validator");
const userController = require("../controller/user.controller");
const router = express.Router();
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


router.post("/signup",
    body("userName").notEmpty(),
    body("userEmail").notEmpty().isEmail(),
    body("userPassword").notEmpty().isLength(6),
    body("userMobile").notEmpty().isMobilePhone(),
    body("userAddress").notEmpty(),

    userController.signup
);

router.post("/signin",
    body("userEmail").notEmpty().isEmail(),
    body("userPassword").notEmpty().isLength(6),
    userController.signin
);
router.post("/signin-with-google",
    body("userEmail").notEmpty().isEmail(),
    userController.signinWithGoogle
);

router.get("/user-by-id/:userId", userController.userById);

router.post("/edit", token.verifyToken, upload.single("userImage"),
    body("userName").notEmpty(),
    body("userEmail").notEmpty().isEmail(),
    body("userMobile").notEmpty().isMobilePhone(),
    body("userAddress").notEmpty(),
    body("userId").notEmpty(),

    userController.updateProfile
);

router.get("/user-list", userController.userList);

router.get("/verify-account/:id", userController.verifyAccountPage);

router.get("/get-verified-account/:id", userController.getVerifiedAccount);

router.post("/forgot-password", userController.forgotPassword);

router.post("/block-user", userController.blockUser)

router.post("/unblock-user", userController.unBlockUser)

module.exports = router;