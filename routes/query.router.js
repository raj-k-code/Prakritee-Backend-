const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const queryController = require('../controller/query.controller');


router.post('/add',
    body("name").notEmpty(),
    body("email").isEmail().notEmpty(),
    body("subject").notEmpty(),
    body("message").notEmpty(),

    queryController.add
);

router.post('/delete',
    body("queryId").notEmpty(),
    queryController.delete
);

router.get('/query-list',
    queryController.queryList
);

router.post('/response-query',
    body("email").isEmail().notEmpty(),
    body("message").notEmpty(),


    queryController.responseQuery)

module.exports = router;