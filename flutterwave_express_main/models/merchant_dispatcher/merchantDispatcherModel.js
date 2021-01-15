const mongoose = require("mongoose");
const { Schema } = mongoose;

const dispatcherMerchantSchema = new Schema({
  dispatcherId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  merchantIds: {
    type: Array,
    trim: true,
  },
}, { timestamps: true });

const MerchantDispatcher = mongoose.model('dispatcher_merchant', dispatcherMerchantSchema);

module.exports = {
  MerchantDispatcher,
}


