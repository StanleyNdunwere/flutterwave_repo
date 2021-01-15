const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  productImageLink: {
    type: String,
    required: true,
    trim: true,
  },
  itemQuantity: {
    type: Number,
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
    required: true,
    trim: true,
  }
}, { timestamps: true });

const Cart = mongoose.model('cart', cartSchema);


module.exports = {
  Cart,
}


