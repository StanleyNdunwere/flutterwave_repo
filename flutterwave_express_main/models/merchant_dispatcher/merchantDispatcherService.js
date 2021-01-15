const { MerchantDispatcher } = require("./MerchantDispatcherModel");
const mongoose = require("mongoose");
const { isUserAdmin, getUser, getAllMerchantWithIds, getAllDispatchersWithIds } = require('../users/userService');
const { ADMIN, MERCHANT, DISPATCH_RIDER } = require('../../global_services/UserUtils')

const getAllMerchantsPerDispatcher = async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.userId);
  const userType = req.user.accountType;
  const dispatcherId = req.params.dispatcherId.trim();
  const isAdmin = await isUserAdmin(userId)
  let merchants = [];
  if (isAdmin || userType === DISPATCH_RIDER) {
    merchantIds = await MerchantDispatcher.find({ dispatcherId: dispatcherId }).select("merchantIds");
    merchants = await getAllMerchantWithIds([...merchantIds[0].merchantIds]);
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "You are not permitted to view this information",
    })
  }
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      merchants: merchants,
    }
  });
}

const getAllDispatchers = async (req, res)=>{
  const userId = mongoose.Types.ObjectId(req.user.userId);
  const userType = req.user.accountType;
  const isAdmin = await isUserAdmin(userId)
  let allDispatchers = [];
  if (isAdmin || userType === MERCHANT) {
    allDispatchers = await MerchantDispatcher.find({ }).select("dispatcherId");
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "You are not permitted to view this information",
    })
  }
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      dispatchers: allDispatchers,
    }
  });
}

const getAllDispatchersPerMerchant = async (req, res) => {
  const userType = req.user.accountType;
  const userId = mongoose.Types.ObjectId(req.user.userId);
  const merchantId = req.params.merchantId.trim();
  const isAdmin = await isUserAdmin(req.user.userId);
  let dispatchers = [];
  if (isAdmin || userType === MERCHANT) {
    let dispatcherIds = await MerchantDispatcher.find({ merchantIds: merchantId }).select("dispatcherId")
    let allIds = dispatcherIds.map((disp) => {
      return disp.dispatcherId;
    })
    dispatchers = await getAllDispatchersWithIds([...allIds])
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "You are not permitted to view this information",
    })
  }
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      dispatchers: dispatchers,
    }
  });
}

const addMerchantToDispatcher = async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.userId);
  const userType = req.user.accountType;
  const merchantId = req.body.merchantId.trim();
  const dispatcherId = req.body.dispatcherId.trim();
  const isAdmin = await isUserAdmin(req.user.userId);
  if (isAdmin || (userType === MERCHANT && req.user.userId === merchantId)) {
    const existingRecord = await MerchantDispatcher.find({ dispatcherId: dispatcherId, merchantIds: merchantId });
    if (existingRecord.length > 0) {
      res.header({ status: 403 }).send({
        status: "failed",
        data: {
          message: "Cannot add yourself twice to the same dispatch service."
        }
      })
    } else {
      await removeMerchantIdFromAllDispatchersRecord(merchantId);
      await MerchantDispatcher.updateOne({ dispatcherId: dispatcherId }, { $push: { merchantIds: merchantId } });
      res.header({ status: 200 }).send({
        status: "success",
        data: {
          message: "Added successfully"
        }
      })
    }
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "You are not permitted to perform this operation",
    })
  }
}

const removeMerchantFromDispatcher = async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.userId);
  const userType = req.user.accountType;
  const merchantId = req.body.merchantId.trim();
  const dispatcherId = req.body.dispatcherId.trim();
  const isAdmin = await isUserAdmin(userId);
  if (isAdmin) {
    removeMerchantIdFromDispatcherRecord(merchantId, dispatcherId);
  } else if (userType === MERCHANT && merchantId === req.user.userId) {
    removeMerchantIdFromDispatcherRecord(merchantId, dispatcherId);
  } else if (userType === DISPATCH_RIDER && dispatcherId === req.user.userId) {
    removeMerchantIdFromDispatcherRecord(merchantId, dispatcherId);
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "You are not permitted to perform this operation",
    })
  }
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      message: "Dispatch Rider Removed Successfully"
    }
  })
}

const removeMerchantIdFromDispatcherRecord = async (merchantId, dispatcherId) => {
  const record = await MerchantDispatcher.find({ dispatcherId: dispatcherId });
  if (record.length === 0) {
    return false;
  } else
    await MerchantDispatcher.updateOne({ dispatcherId: dispatcherId }, { $pull: { merchantIds: merchantId } });
  return true;
}

const removeMerchantIdFromAllDispatchersRecord = async (merchantId) => {
  await MerchantDispatcher.updateMany({}, { $pull: { merchantIds: merchantId } });
  return true;
}

const createDispatcherRecord = async (dispatcherId) => {
  const newDispatcher = await MerchantDispatcher.create({
    dispatcherId: dispatcherId,
    merchantIds: [],
  });
  return newDispatcher;
}

const deleteAllDispatcherRecord = async (dispatcherId) => {
  await MerchantDispatcher.deleteOne({ dispatcherId: dispatcherId });
}

module.exports = {
  getAllMerchantsPerDispatcher,
  getAllDispatchersPerMerchant,
  addMerchantToDispatcher,
  removeMerchantFromDispatcher,
  createDispatcherRecord,
  removeMerchantIdFromDispatcherRecord,
  deleteAllDispatcherRecord,
  removeMerchantIdFromAllDispatchersRecord
}


