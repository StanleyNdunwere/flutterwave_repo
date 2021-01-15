const { Cart } = require("./cartModel");
const mongoose = require("mongoose");
var os = require('os');
const { USER } = require('../../global_services/UserUtils')

const uploadFolder = "/uploads";

const deleteSingleCartItem = async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.userId);
  const itemId = mongoose.Types.ObjectId(req.params.itemId)

  items = await Cart.deleteOne({ userId: req.user.userId, _id: itemId });
  res.header({ status: 200 }).send({
    status: "success",
    message: "Item Deleted",
  });
}

const createCartItem = async (req, res) => {
  const userType = req.user.accountType;
  const existingCartItem = await Cart.find({ productId: req.body.productId })
  let item = [];
  if (userType === USER) {
    if (existingCartItem.length > 0) {
      await Cart.updateOne({ productId: req.body.productId }, { $set: { itemQuantity: req.body.itemQuantity } })
      item = await Cart.find({ productId: req.body.productId, userId: req.body.userId })
    } else {
      item = await Cart.create({
        userId: req.user.userId,
        productId: req.body.productId,
        productName: req.body.productName,
        currencyCode: req.body.currencyCode,
        deliveryCost: req.body.deliveryCost,
        price: req.body.price,
        itemQuantity: req.body.itemQuantity,
        productImageLink: req.body.productImageLink,
      });
    }
    res.header({ status: 200 }).send({
      status: "success",
      message: "New Item added successfully",
      data: {
        item: item
      }
    })
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "You don't have the privileges to create carts"
    })
  }
}

const getAllCartItemsPerUser = async (req, res) => {
  let items = [];

  items = await Cart.find({ userId: req.user.userId });
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      items: items,
    }
  });
}


module.exports = {
  getAllCartItemsPerUser,
  createCartItem,
  deleteSingleCartItem,
}