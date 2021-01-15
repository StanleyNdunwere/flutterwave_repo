const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  transactionRef: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    trim: true,
  },
  productImageLink: {
    type: String,
    trim: true,
  },
  transactionId: {
    type: String,
    trim: true,
  },
  transactionType: {
    type: String,
    trim: true,
  },
  merchantId: {
    type: String,
    trim: true,
  },
  merchantName: {
    type: String,
    trim: true,
  },
  dispatchId: {
    type: String,
    trim: true,
  },
  currencyCode: {
    type: String,
    trim: true,
  },
  dispatchName: {
    type: String,
    trim: true,
  },
  productId: {
    type: String,
    trim: true,
  },
  productName: {
    type: String,
    trim: true,
  },
  quantity: {
    type: String,
    trim: true,
  },
  totalProductPricePaid: {
    type: String,
    trim: true,
  },
  totalDeliveryPricePaid: {
    type: String,
    trim: true,
  },
  jumgaDeliveryCut: {
    type: String,
    trim: true,
  },
  jumgaProductCut: {
    type: String,
    trim: true,
  },
  merchantCut: {
    type: String,
    trim: true,
  },
  dispatchCut: {
    type: String,
    trim: true,
  },
  buyerName: {
    type: String,
    trim: true,
  },
  buyerPhone: {
    type: String,
    trim: true,
  }

}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);

module.exports = {
  Order,
}


