const mongoose = require("mongoose");
const { Schema } = mongoose;


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: [5, 'Username is too short'],
    max: [100, 'Username too long'],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: [5, 'Password is too short'],
    trim: true,
    max: [200, "Password too long"],
  },
  active: Number,
  country: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    trim: true,
    required: true,
  },
  accountEmail: {
    type: String,
    trim: true,
    required: true,
  },
  bankCode: {
    type: String,
    trim: true,
    required: true,
  },
  bankName: {
    type: String,
    trim: true,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },
  subAccountId: {
    type: Number,
    trim: true,
  },
  subAccountIdKey: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);


module.exports = {
  User,
}


