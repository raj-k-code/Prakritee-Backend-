const express = require("express");
const { body } = require("express-validator");
const gardenerController = require("../controller/gardener.controller");
const router = express.Router();
const firebase = require("../middleware/firebase.middleware");
const token = require("../middleware/token.middleware");

const multer = require("multer");
var storage = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

var upload = multer({ storage: storage });


router.post("/signup",
    body("gardenerName").notEmpty(),
    body("gardenerEmail").notEmpty().isEmail(),
    body("gardenerPassword").notEmpty().isLength(8),
    body("gardenerMobile").notEmpty().isMobilePhone(),
    body("gardenerAddress").notEmpty(),
    body("gardenerExperience").notEmpty(),

    gardenerController.signup
);

router.get("/check-email/:gardenerEmail", gardenerController.checkEmail);

router.get("/check-mobile/:gardenerMobile", gardenerController.checkMobile);


router.post("/signin",
    body("gardenerEmail").notEmpty().isEmail(),
    body("gardenerPassword").notEmpty(),
    gardenerController.signin
);

router.post("/signin-with-google",
    body("gardenerEmail").notEmpty().isEmail(),
    gardenerController.signinWithGoogle
);

router.post("/edit", token.verifyToken, upload.single("gardenerImage"),
    body("gardenerName").notEmpty(),
    body("gardenerEmail").notEmpty().isEmail(),
    body("gardenerMobile").notEmpty().isMobilePhone(),
    body("gardenerAddress").notEmpty(),
    body("gardenerExperience").notEmpty(),
    body("gardenerId").notEmpty(),

    firebase.fireBaseStorage,
    gardenerController.updateProfile
);

router.get("/gardener-list", gardenerController.gardenerList);

router.get("/verify-account/:id", gardenerController.verifyAccountPage);

router.get("/get-verified-account/:id", gardenerController.getVerifiedAccount);

router.post("/forgot-password", gardenerController.forgotPassword);

router.post("/block-gardener", gardenerController.blockGardener);

router.post("/unblock-gardener", gardenerController.unBlockGardener)

router.post("/rate-the-gardener", gardenerController.rateTheGardener);

router.post("/book-gardener", gardenerController.bookTheGardener);

router.post("/approve-request", gardenerController.approveRequest);

router.post("/complete-request", gardenerController.completeRequest);

router.post("/cancel-request", gardenerController.cancelRequest);

router.post("/view-request", gardenerController.viewRequest);

router.get("/gardner-by-id/:gardenerId", gardenerController.gardenerById);

router.post("/already-exist", gardenerController.alreadyExist);

module.exports = router;