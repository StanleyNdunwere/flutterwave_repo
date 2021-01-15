var express = require('express');
var router = express.Router();
const { auth } = require("../middleware/Auth")
const { getAllMerchantsPerDispatcher, getAllDispatchersPerMerchant, addMerchantToDispatcher, removeMerchantFromDispatcher, } = require('../models/merchant_dispatcher/MerchantDispatcherService');
const { getAllDispatchRiders } = require('../models/users/userService');


router.get("/merchants/:dispatcherId", auth, getAllMerchantsPerDispatcher)

router.get("/dispatchers/:merchantId", auth, getAllDispatchersPerMerchant)

router.patch("/", auth, addMerchantToDispatcher);

router.put("/", auth, removeMerchantFromDispatcher);


module.exports = router;
