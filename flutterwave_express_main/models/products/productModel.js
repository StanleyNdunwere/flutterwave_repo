const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  deliveryCost: {
    type: Number,
    required: true,
    trim: true,
  },
  currencyCode: {
    type: String,
    trim: true,
  },
  merchantId: {
    type: String,
    required: true,
    trim: true,
  },
  productImageLink: {
    type: String,
    trim: true
  },
}, { timestamps: true });

const Product = mongoose.model('product', productSchema);

module.exports = {
  Product,
}


