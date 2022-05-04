const express = require("express");
const { body } = require("express-validator");
const nurseryownerController = require("../controller/nurseryowner.controller");
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
    body("nurseryName").notEmpty(),
    body("nurseryOwnerName").notEmpty(),
    body("nurseryOwnerEmail").notEmpty().isEmail(),
    body("nurseryOwnerPassword").notEmpty().isLength(6),
    body("nurseryOwnerMobile").notEmpty().isMobilePhone(),
    body("nurseryAddress").notEmpty(),

    nurseryownerController.signup
);

router.post("/signin",
    body("nurseryOwnerEmail").notEmpty().isEmail(),
    body("nurseryOwnerPassword").notEmpty().isLength(6),
    nurseryownerController.signin
);

router.post("/signin-with-google",
    body("nurseryOwnerEmail").notEmpty().isEmail(),
    nurseryownerController.signinWithGoogle
);

router.post("/edit", token.verifyToken, upload.single("Image"),
    body("nurseryName").notEmpty(),
    body("nurseryOwnerName").notEmpty(),
    body("nurseryOwnerEmail").notEmpty().isEmail(),
    body("nurseryOwnerPassword").notEmpty().isLength(6),
    body("nurseryOwnerMobile").notEmpty().isMobilePhone(),
    body("nurseryAddress").notEmpty(),
    body("nurseryownerId").notEmpty(),

    nurseryownerController.updateProfile
);

router.get("/nursery-list", nurseryownerController.nurseryList);

router.get("/verify-account/:id", nurseryownerController.verifyAccountPage);

router.get("/get-verified-account/:id", nurseryownerController.getVerifiedAccount);

router.post("/forgot-password", nurseryownerController.forgotPassword);

router.post("/block-nursery", nurseryownerController.blockNursery)

router.post("/unblock-nursery", nurseryownerController.unBlockNursery)

module.exports = router;