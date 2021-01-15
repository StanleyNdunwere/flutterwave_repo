const { Product } = require("./ProductModel");
const mongoose = require("mongoose");
const path = require("path")
var os = require('os');
const { isUserAdmin, getUser } = require('../users/userService')
const { ADMIN, MERCHANT, DISPATCH_RIDER } = require('../../global_services/UserUtils');
const { MerchantDispatcher } = require("../merchant_dispatcher/MerchantDispatcherModel");

const uploadFolder = "/uploads";

const getAllProducts = async (req, res) => {
  let products = await Product.find({});
  products.forEach((product) => {
    product.productImageLink = "http://" + req.headers.host + product.productImageLink;

  })
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      products: products,
    }
  });
}

const getAllProductsPerMerchant = async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.userId);
  const isAdmin = await isUserAdmin(req.user.userId)
  let products = [];
  if (isAdmin) {
    let products = await Product.find({});
  } else if (req.user.accountType === MERCHANT) {
    products = await Product.find({ merchantId: req.user.userId });
  } else {
    products = [];
  }
  // req.headers.host +
  products.forEach((product) => {
    product.productImageLink = "http://" + req.headers.host + product.productImageLink;

  })
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      products: products,
    }
  });
}

const createProduct = async (req, res) => {
  const merchantId = req.user.userId;
  const dispatcherIds = await MerchantDispatcher.find({ merchantIds: merchantId }).select("dispatcherId")
  if (dispatcherIds.length <= 0) {
    res.header({ status: 403 }).send({
      status: "Failed",
      message: "You must choose a rider before you add a product. Go to your dashboard and select 'Choose a rider to add a rider to your merchant account'",
      data: null
    });
    return
  }

  let imageLink = "";
  if (req.file) {
    const storagePathArray = req.file.path.split(path.sep).join(path.posix.sep).split("/");
    storagePathArray.shift();
    imageLink = "/" + storagePathArray.join("/")
  } else {
    imageLink = uploadFolder + "/shopping_bag.png"
  }

  const userType = req.user.accountType;
  if (userType === MERCHANT) {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      currencyCode: req.body.currencyCode,
      deliveryCost: req.body.deliveryCost,
      merchantId: req.user.userId,
      productImageLink: imageLink,
    })
    res.header({ status: 200 }).send({
      status: "success",
      data: {
        product: product
      }
    })
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "You don't have the privileges to create products"
    })
  }
}



const getSingleProduct = async (req, res) => {
  const productId = mongoose.Types.ObjectId(req.params.productId);
  const userId = mongoose.Types.ObjectId(req.user.userId);
  const isAdmin = await isUserAdmin(req.user.userId)
  const userType = req.user.accountType;
  let product = {};
  if (isAdmin) {
    product = await Product.find({ _id: productId });
  } else if (userType === MERCHANT) {
    product = await Product.find({ merchantId: req.user.userId, _id: productId });
  } else {
    res.header({ status: 413 }).send({
      status: "failed",
      message: "Not allowed to view products"
    })
  }

  product.productImageLink = "http://" + req.headers.host + product.productImageLink;
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      product: product[0],
    }
  });
}

const getSingleProductAllUsers = async (req, res) => {
  const productId = mongoose.Types.ObjectId(req.params.productId);
  let product = await Product.find({ _id: productId });
  let productItem = product[0];
  productItem.productImageLink = "http://" + req.headers.host + productItem.productImageLink;
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      product: productItem,
    }
  });
}



const updateProduct = async (req, res) => {
  const productId = mongoose.Types.ObjectId(req.params.productId);
  const merchantId = req.params.merchantId;
  const userId = mongoose.Types.ObjectId(req.user.userId);
  const isAdmin = await isUserAdmin(req.user.userId)
  const userType = req.user.accountType;
  const updatedProduct = req.body;
  let response = {};

  if (isAdmin) {
    await Product.updateOne({ _id: productId, }, { $set: { ...updatedProduct } });
    response = await Product.find({ _id: productId });
  } else if (userType === MERCHANT) {
    await Product.updateOne({ _id: productId, merchantId: merchantId }, { $set: { ...updatedProduct } });
    response = await Product.find({ _id: productId, merchantId: merchantId });
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "Not permitted to modify products"
    });
  }
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      updatedProduct: response[0],
    }
  });
}

const deleteProduct = async (req, res) => {
  const productId = mongoose.Types.ObjectId(req.params.productId);
  const requestorId = req.user.userId;
  const userId = mongoose.Types.ObjectId(requestorId);
  const isAdmin = await isUserAdmin(req.user.userId)
  const userType = req.user.accountType;

  if (isAdmin) {
    await Product.deleteOne({ _id: productId });
    res.header({ status: 200 }).send({
      status: "success",
      data: {
        deleteId: req.params.productId,
      }
    });
  } else if (userType === MERCHANT) {
    await Product.deleteOne({ _id: productId, merchantId: requestorId });
    res.header({ status: 200 }).send({
      status: "success",
      data: {
        deleteId: req.params.productId,
      }
    });
  } else {
    res.header({ status: 403 }).header({
      status: "failed",
      message: "Not permitted to delete product",
    })
  }
}

const deleteMultipleProducts = async (req, res) => {
  const productsToDelete = req.body.productsToDelete.map((productId) => {
    return mongoose.Types.ObjectId(productId);
  });
  const requestorId = req.user.userId;
  const userId = mongoose.Types.ObjectId(requestorId);
  const isAdmin = await isUserAdmin(req.user.userId)
  const userType = req.user.accountType;

  if (isAdmin) {
    await User.deleteMany({ _id: { $in: productsToDelete } });
    res.header({ status: 200 }).send({
      status: "success",
      data: {
        deletedProductsId: req.body.productsToDelete,
      }
    });
  } else if (userType === MERCHANT) {
    await Product.deleteMany({ _id: { $in: productsToDelete }, merchantId: requestorId });
    res.header({ status: 200 }).send({
      status: "success",
      data: {
        deleteId: req.body.productsToDelete,
      }
    });
  } else {
    res.header({ status: 403 }).header({
      status: "failed",
      message: "Not permitted to delete products",
    })
  }
}

const isProductDuplicate = async (productName, merchantId) => {
  const product = await Product.find({ name: productName, merchantId: merchantId });
  return product.length > 0;
}

module.exports = {
  getAllProducts,
  getAllProductsPerMerchant,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  isProductDuplicate,
  getSingleProductAllUsers,
  uploadFolder,
}