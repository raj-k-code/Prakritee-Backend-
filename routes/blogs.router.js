const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const blogController = require('../controller/blogs.controller');

const firebase = require("../middleware/firebase.middleware");

const multer = require("multer");
var storage = multer.diskStorage({
    destination: "public/images",
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

var upload = multer({ storage: storage });

router.post('/add', upload.single('blogImage'),
    body("blogTitle").notEmpty(),
    body("blogSubTitle").notEmpty(),
    body("blogContent").notEmpty(),
    body("createdBy").notEmpty(),

    firebase.fireBaseStorage,
    blogController.addBlog
);

router.post('/delete',
    body("blogId").notEmpty(),
    blogController.deleteBlog
);

router.get('/blog-list',
    blogController.blogList
);

router.post('/edit', upload.single('blogImage'),
    body("blogTitle").notEmpty(),
    body("blogSubTitle").notEmpty(),
    body("blogContent").notEmpty(),
    body("createdBy").notEmpty(),
    body("blogId").notEmpty(),
    body("oldImage").notEmpty(),


    firebase.fireBaseStorage,
    blogController.editBlog
);

router.get("/blog-by-id/:id", blogController.blogById);

module.exports = router;