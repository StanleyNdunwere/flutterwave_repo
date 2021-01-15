const { isProductDuplicate } = require('../models/products/productService')
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");


const duplicate = async (req, res, next) => {
  const id = req.user.userId;
  const isDuplicate = await isProductDuplicate(req.body.name, id);
  if (isDuplicate) {
    const imgPath = path.join(__dirname, "../", req.file.path)
    fs.unlink(imgPath, (err => {
      if (err) {
        console.log(err);
      }
    }));
    res.header({ status: 403 }).send({
      status: "failed",
      message: "You cannot create duplicate products"
    });
  } else {
    next();
  }
}

module.exports = {
  duplicate,
}