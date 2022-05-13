const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');

router.post("/view-order", orderController.viewOrder);

router.post("/order", orderController.order);

router.post("/order-status", orderController.orderStatus);


module.exports = router;