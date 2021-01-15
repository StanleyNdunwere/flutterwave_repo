const { User } = require("./userModel");
const mongoose = require("mongoose");
const { createSubAccount, singlePaymentDataTemplate, payRegistrationFee, removeSubAccount } = require("../../global_services/transactionUtils")
const { createDispatcherRecord, deleteAllDispatcherRecord, removeMerchantIdFromAllDispatchersRecord } = require("../merchant_dispatcher/merchantDispatcherService")
const { generateJWT, jwtExpirySeconds } = require('../../global_services/jwtService')
const bcrypt = require('bcrypt');
const { ADMIN, MERCHANT, DISPATCH_RIDER, USER } = require('../../global_services/UserUtils');
const { MerchantDispatcher } = require("../merchant_dispatcher/MerchantDispatcherModel");

const saltCount = 4;

const getAccountTypes = (req, res) => {
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      message: "Data fetched successfully",
      accountTypes: [{ [ADMIN]: "ADMIN" }, { [MERCHANT]: "MERCHANT" }, { [DISPATCH_RIDER]: "DISPATCH RIDER" }]
    }
  })
}

const createUser = async ({ body: userData }, res) => {
  const newUser = {
    username: userData.username,
    active: 0,
    accountType: userData.accountType,
    accountEmail: userData.accountEmail,
    country: userData.country,
    bankCode: "044",//cannnot test with any other bank except access bank from api
    bankName: "Access Bank",
    // accountNumber: rotateAccountNumbers(),
    accountNumber: "0690000037",
  };

  if (userData.accountType === ADMIN) {
    res.header({ status: 400 }).send({
      status: 'failed',
      message: "Cannot provision an admin account for you sorry",
    })
    return;
  }

  const hashedPassword = await bcrypt.hash(userData.password, saltCount);

  if (newUser.accountType !== USER) {
    const newUserInfo = await User.create({ ...newUser, password: hashedPassword });

    if (userData.accountType === DISPATCH_RIDER) {
      await createDispatcherRecord(newUserInfo._id.toString());
      await User.updateOne({ username: newUserInfo.username }, { $set: { active: 1 } })
    }
    const subAccount = await createSubAccount(newUser.bankCode, newUser.accountNumber, newUser.username,
      newUser.accountEmail, newUser.country, userData.accountType);
    if (subAccount === null) {
      await performDeleteOperation(newUserInfo._id.toString());
      res.header({ status: 400 }).send({
        status: 'failed',
        message: `Unable to provision your ${newUser.accountType} account, please sign in with a valid account number.
       Your chosen account numberis taken or invalid`
      });
    } else {
      await User.updateOne({ _id: newUserInfo._id },
        { $set: { subAccountIdKey: subAccount.subaccount_id, subAccountId: subAccount.id } })
      res.header({ status: 200 }).send({
        status: "success",
        message: "New Account was created succesfully",
      });

    }
  } else {
    const newUserInfo = await User.create({ ...newUser, password: hashedPassword, active: 1 });
    res.header({ status: 200 }).send({
      status: "success",
      message: "New User Account was created succesfully",
    });
  }
}

const loginUser = async ({ body: loginData }, res) => {
  const userArr = await User.find({ username: loginData.username });
  if (userArr.length === 0) {
    res.header({
      status: 404
    }).send({
      status: "failed",
      message: "Username or password invalid"
    })
  } else {
    const user = userArr[0];
    const passwordStored = user.password;
    const requestPassword = loginData.password;
    bcrypt.compare(requestPassword, passwordStored, function (err, result) {
      if (result == true) {
        const token = generateJWT(user["username"], user["accountType"], user["id"]);
        res.header({ status: 200 })
          .cookie("authorization", token, { maxAge: jwtExpirySeconds * 1000 })
          .send({
            status: "success",
            message: "Login Successful",
            data: {
              token: token,
              username: user.username,
              accountType: user.accountType,
              id: user._id,
            }
          });
      } else {
        res.header({ status: 404 }).send({
          status: "failed",
          message: "Invalid Username/Password",
        });
      }
    });
  }
}

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  const requestor = req.user;
  const isAdmin = await isUserAdmin(requestor.userId);
  if (isAdmin) {
    res.header({ status: 200 }).send({
      status: "success",
      data: {
        users: users,
      }
    })
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "Not authorized to access this information"
    })
  }
}

const getSingleUser = async (req, res) => {
  const requestor = req.user;
  
  validateUserId(req.params.id, res);
  const isAdmin = await isUserAdmin(requestor.userId);
  const objUserId = mongoose.Types.ObjectId(req.params.id);
  const userDetails = await User.find({ _id: objUserId }).select("-password");
  if (isAdmin || requestor.userId === req.params.id) {
    res.header({ status: 200 }).send({
      status: "success",
      data: { user: userDetails[0] },
    })
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "Invalid user details requested. Cannot find this user in our records"
    })
  }
}

const deleteSingleUser = async (req, res) => {
  const currentUserId = req.user.userId;
  const userToDeleteId = req.params.id;
  validateUserId(req.params.id, res);
  
  const isAdmin = await isUserAdmin(currentUserId);
  if (isAdmin) {
    if (currentUserId === userToDeleteId) {
      res.send({
        status: "failed",
        message: "Cannot delete self even with super admin privileges. Drop database instead, lol."
      })
    } else {
      await performDeleteOperation(req.params.id);
      res.header({ status: 200 }).send({
        status: "success",
        message: "User deleted successfully"
      })
    }
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "Not permitted to access feature"
    })
  }
}

const performDeleteOperation = async (idString) => {
  const objId = mongoose.Types.ObjectId(idString);
  const user = await User.find({ _id: objId });
  const subAccountId = user[0].subAccountId;
  if (subAccountId != null) {
    await removeSubAccount(subAccountId);
  }
  await User.deleteOne({ _id: objId });
  await deleteAllDispatcherRecord(idString);
  await removeMerchantIdFromAllDispatchersRecord(idString);
}

const deleteMultipleUsers = async (req, res) => {
  const userIdVal = req.user.userId;
  const usersToDelete = req.body.usersToDelete.map((userId) => {
    validateUserId(userId, res);
    return mongoose.Types.ObjectId(userId);
  })
  const isAdmin = await isUserAdmin(userIdVal);
  if (isAdmin) {
    if (req.body.usersToDelete.includes(req.user.userId)) {
      res.send({
        status: "failed",
        message: "Cannot delete self even with super admin privileges. Drop database instead, lol."
      })
    } else {
      await User.deleteMany({ _id: { $in: usersToDelete } });
      await MerchantDispatcher.updateMany({}, { $pullAll: { merchantIds: req.body.usersToDelete } })
      await MerchantDispatcher.deleteMany({ dispatcherId: { $in: req.body.usersToDelete } })
      res.header({ status: 200 }).send({
        status: "success",
        message: "User(s) deleted successfully"
      })
    }
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "Not permitted to access feature"
    })
  }
}

const updateActiveStatus = async (req, res) => {
  const idToUpdate = req.body.id.trim();
  if (idToUpdate === null || idToUpdate.length === 0) {
    res.header({ status: 400 }).send({
      status: "failed",
      message: "ID for Object to delete cannot be null or empty"
    })
  }
  //other api verifications will happen here or in a custom middleware for this route
  const objId = mongoose.Types.ObjectId(idToUpdate);
  await User.updateOne({ _id: objId }, { $set: { active: 1 } });
  res.header({ status: 200 }).send({
    status: "success",
    message: "User account is now active"
  })
}

const getAllMerchants = async (req, res) => {
  const userIdVal = (req.user.userId);
  const isAdmin = await isUserAdmin(userIdVal);
  if (isAdmin) {
    const merchants = await User.find({ accountType: MERCHANT }).select("-password");
    res.header({ status: 200 }).send({
      status: "success",
      data: {
        message: "success",
        merchants: [...merchants]
      }
    })
  } else {
    res.header({ status: 403 }).send({
      status: 'failed',
      message: "Not authorized to access this information"
    });
  }
}

const getMerchantWithId = async (req, res) => {
  const userIdVal = mongoose.Types.ObjectId(req.user.userId);
  const merchantId = req.params.merchantId.trim();
  const merchants = await User.find({ accountType: MERCHANT, _id: merchantId }).select("-password");
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      merchants: merchants[0]
    }
  });
}

const getAllDispatchRiders = async (req, res) => {
  const userIdVal = (req.user.userId);
  const isAdmin = await isUserAdmin(userIdVal);
  if (isAdmin || req.user.accountType === MERCHANT) {
    const riders = await User.find({ accountType: DISPATCH_RIDER }).select("-password");;
    res.header({ status: 200 }).send({
      status: "success",
      data: {
        riders: riders
      }
    })
  } else {
    res.header({ status: 403 }).send({
      status: 'failed',
      message: "Not authorized to access this information"
    })
  }
}

const getDispatcherWithId = async (req, res) => {
  const userIdVal = mongoose.Types.ObjectId(req.user.userId);
  const dispatcherId = req.params.dispatcherId;
  const riders = await User.find({ accountType: DISPATCH_RIDER, _id: dispatcherId }).select("-password");;
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      riders: riders[0]
    }
  });
}

const getAllBanksWithCodesByCountryCode = (req, res) => {
  const bank = req.params.bank;
  const baseUrlFlutterwave = "https://api.flutterwave.com/v3/banks/"
  axios.get(baseUrlFlutterwave + bank)
    .then(function (response) {
      res.header({ status: 200 }).send({
        status: "success",
        data: response.data
      })
    })
    .catch(function (error) {
      res.header({ status: 400 }).send({
        status: "failed",
        data: { message: "Unable to get list" }
      })
    });
}

const validateUserId = (id, res) => {
  if (id.length < 16) {
    res.header({ status: 400 }).send(
      {
        status: "failed",
        message: "Invalid User Id: " + id
      }
    )
  }
}

const getAllMerchantWithIds = async (merchantIdArray) => {
  const merchantObjIds = merchantIdArray.map((id) => {
    return mongoose.Types.ObjectId(id);
  })
  const merchants = await User.find({ _id: { $in: merchantObjIds } }).select("-password").select("-active").select("-country");
  return merchants;
}

const getAllDispatchersWithIds = async (dispatcherIdArray) => {
  const dispatcherObjIds = dispatcherIdArray.map((id) => {
    return mongoose.Types.ObjectId(id);
  })
  const dispatchers = await User.find({ _id: { $in: dispatcherObjIds } }).select("-password").select("-active").select("-country");
  return dispatchers;
}

const getUser = async (userId) => {
  const userIdVal = mongoose.Types.ObjectId(userId);
  const user = await User.find({ _id: userIdVal }).select("-password");
  return user;
}

const isUserAdmin = async (userId) => {
  const user = await getUser(userId);
  if (user.length === 0) {
    return false;
  }
  return user[0].accountType === ADMIN;
}

const isUsernameDuplicate = async (username) => {
  const isDuplicate = await User.find({ username: username })
  return isDuplicate.length > 0;
}

const rotateAccountNumbers = () => {
  const latest = process.env.lastAccNo;
  process.env["lastAccNo"] = "0" + (parseInt(latest) + 1).toString();
  return process.env["lastAccNo"];
}


module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  deleteMultipleUsers,
  updateActiveStatus,
  getAccountTypes,
  getAllMerchants,
  getAllDispatchRiders,
  getMerchantWithId,
  getDispatcherWithId,
  getAllDispatchersWithIds,
  getAllMerchantWithIds,
  isUserAdmin,
  getUser,
  isUsernameDuplicate,
}

