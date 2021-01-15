
var express = require('express');
var router = express.Router();
const { auth } = require("../middleware/Auth")
const { getAllCartItemsPerUser, deleteSingleCartItem, createCartItem, } = require('../models/cart/cartService');

router.post("/", auth, createCartItem);

router.get("/", auth, getAllCartItemsPerUser)

router.delete("/:itemId", auth, deleteSingleCartItem)

module.exports = router;
