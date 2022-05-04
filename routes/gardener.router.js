const express = require("express");
const { body } = require("express-validator");
const gardenerController = require("../controller/gardener.controller");
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
    body("gardenerName").notEmpty(),
    body("gardenerEmail").notEmpty().isEmail(),
    body("gardenerPassword").notEmpty().isLength(6),
    body("gardenerMobile").notEmpty().isMobilePhone(),
    body("gardenerAddress").notEmpty(),
    body("gardenerExperience").notEmpty(),

    gardenerController.signup
);

router.post("/signin",
    body("gardenerEmail").notEmpty().isEmail(),
    body("gardenerPassword").notEmpty().isLength(6),
    gardenerController.signin
);

router.post("/signin-with-google",
    body("gardenerEmail").notEmpty().isEmail(),
    gardenerController.signinWithGoogle
);

router.post("/edit", token.verifyToken, upload.single("gardenerImage"),
    body("gardenerName").notEmpty(),
    body("gardenerEmail").notEmpty().isEmail(),
    body("gardenerPassword").notEmpty().isLength(6),
    body("gardenerMobile").notEmpty().isMobilePhone(),
    body("gardenerAddress").notEmpty(),
    body("gardenerExperience").notEmpty(),
    body("gardenerId").notEmpty(),

    gardenerController.updateProfile
);

router.get("/gardener-list", gardenerController.gardenerList);

router.get("/verify-account/:id", gardenerController.verifyAccountPage);

router.get("/get-verified-account/:id", gardenerController.getVerifiedAccount);

router.post("/forgot-password", gardenerController.forgotPassword);

router.post("/block-gardener", gardenerController.blockGardener)

router.post("/unblock-gardener", gardenerController.unBlockGardener)

module.exports = router;