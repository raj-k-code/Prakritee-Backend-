const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');

router.post("/view-order", orderController.viewOrder);

router.post("/order", orderController.order);

router.post("/order-status", orderController.orderStatus);

router.get("/order-by-id/:id", orderController.orderById);

router.post("/order-history-by-nursery", orderController.historyByNursery);

router.post("/latest-order", orderController.latestOrder);

router.post("/change-order", orderController.changeOrderStatus);

module.exports = router;