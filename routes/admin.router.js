const express = require("express");
const { body } = require("express-validator");
const adminController = require("../controller/admin.controller");
const router = express.Router();
const firebase = require("../middleware/firebase.middleware");

const multer = require("multer");
var storage = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

var upload = multer({ storage: storage });

router.post('/signin',
    body("email").isEmail().notEmpty(),
    body("password").notEmpty().isLength(6),

    adminController.signin
);

router.post('/signin-with-google',
    body("email").isEmail().notEmpty(),

    adminController.signinWithGoogle
);

router.post('/category/add', upload.single('categoryImage'),
    body("categoryName").notEmpty(),
    firebase.fireBaseStorage,
    adminController.addCategory
);

router.post('/category/delete',
    body("categeryId").notEmpty(),
    adminController.deleteCategory
);

router.get('/category/category-list',
    adminController.categoryList
);

router.post('/category/edit', upload.single('categoryImage'),
    body("categoryName").notEmpty(),
    body("categeryId").notEmpty(),
    firebase.fireBaseStorage,
    adminController.editCategory
);

router.get('/gardener/gardener-list',
    adminController.gardenerList
);

router.get("/category-by-id/:id", adminController.categoryById);

router.get("/nursery/nursery-list", adminController.nurseryList);

router.get("/user/user-list", adminController.userList);

router.post("/forgot-password", adminController.forgotPassword);


module.exports = router;