var express = require('express');
const { verify } = require('jsonwebtoken');
var router = express.Router();
const { auth } = require("../middleware/Auth")
const { getAllOrders, createOrder, verifyPayment, getRiderSummary, getAllSalesJumga, getMerchantSummary, paymentRedirect, processDirectSingleOrder, processCartOrders, completeRegistration } = require('../models/orders/orderService')


router.get("/", auth, getAllOrders)

router.get("/merchant-summary/:merchantId", auth, getMerchantSummary)

router.get("/dispatch-summary/:riderId", auth, getRiderSummary)

router.get("/commissions", auth, getAllSalesJumga)

router.get("/registration", auth, completeRegistration)

router.post("/", auth, createOrder)

router.post("/single", auth, processDirectSingleOrder)

router.post("/multiple", auth, processCartOrders)

router.post("/guest/single", processDirectSingleOrder)

router.post("/guest/multiple", processCartOrders)

router.get("/payment", verifyPayment);

router.get("/payments", paymentRedirect);

module.exports = router;
