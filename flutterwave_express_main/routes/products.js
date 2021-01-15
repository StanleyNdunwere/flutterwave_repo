var express = require('express');
const path = require('path');
const uuid = require("uuid")
var router = express.Router();
const { auth } = require("../middleware/Auth")
const { duplicate } = require("../middleware/duplicateProduct");
const multer = require('multer');
const { getAllProducts, createProduct, getSingleProduct, getAllProductsPerMerchant, updateProduct, deleteProduct, deleteMultipleProducts, uploadFolder, getSingleProductAllUsers } = require('../models/products/ProductService');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public' + uploadFolder);
  },
  filename: function (req, file, cb) {
    const date = new Date();
    cb(null, uuid.v4().split("-").join("") + "_" + file.originalname.split(" ").join("_"));
  }
});
let upload = multer({ storage })
const { read } = require('fs');


router.post("/", auth, upload.single('productImageLink'), duplicate, createProduct);

router.get("/", getAllProducts)

router.get("/merchant", auth, getAllProductsPerMerchant)

router.get("/:productId", auth, getSingleProduct)

router.get("/all/:productId", getSingleProductAllUsers)

router.patch('/:productId/:merchantId', auth, updateProduct);

router.delete('/', auth, deleteMultipleProducts)

router.delete('/:productId', auth, deleteProduct)

module.exports = router;
