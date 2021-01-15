const { Order } = require("./orderModel");
const url = require('url');
const uuid = require("uuid")
const mongoose = require("mongoose");
const { isUserAdmin, getUser } = require('../users/userService')
const { ADMIN, MERCHANT, DISPATCH_RIDER, USER } = require('../../global_services/UserUtils')
const { computeSplitOfOrder, verifyPaymentAccount, singlePaymentDataTemplate, buyProduct, singleProductPaymentTemplate, cartProductPaymentTemplate, payRegistrationFee } = require("../../global_services/transactionUtils");
const { User } = require("../users/userModel");
const { Product } = require("../products/ProductModel");
const { MerchantDispatcher } = require("../merchant_dispatcher/MerchantDispatcherModel");
const { Cart } = require("../cart/cartModel");
const { response } = require("express");

const getAllOrders = async (req, res) => {
  const isAdmin = await isUserAdmin(req.user.userId);
  let orders = [];
  if (isAdmin) {
    orders = await Order.find({});
  } else if (req.user.accountType === MERCHANT) {
    orders = await Order.find({ merchantId: req.user.userId });
  } else if (req.user.accountType === DISPATCH_RIDER) {
    orders = await Order.find({ dispatchId: req.user.userId });
  } else if (req.user.accountType === USER) {
    orders = await Order.find({ userId: req.user.userId });
  }
  orders.forEach(order => {
    order.productImageLink = "http://" + req.headers.host + order.productImageLink;
  })
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      orders: orders,
    }
  });
}

const getMerchantSummary = async (req, res) => {
  let userType = req.user.accountType;
  const merchantId = req.params.merchantId

  if (userType === "admin" || req.user.userId === req.params.merchantId) {
    const allMerchantTransactions = await Order.find({ merchantId: merchantId })
    let totalSalesAmount = 0;
    let totalVolumeSold = 0;
    let totalCommissionsPaid = 0;
    let merchantName = allMerchantTransactions[0].dispatchName
    let accountType = MERCHANT;

    allMerchantTransactions.forEach(transaction => {
      let merchantCut = transaction.merchantCut != null ? transaction.merchantCut : "0"
      let quantity = transaction.quantity != null ? transaction.quantity : "0"
      let commission = transaction.jumgaProductCut != null ? transaction.jumgaProductCut : "0"
      totalSalesAmount += parseFloat(merchantCut)
      totalVolumeSold += parseFloat(quantity)
      totalCommissionsPaid += parseFloat(commission)
    })

    res.header({ status: 200 }).send({
      status: "success",
      message: "Computed Successfully",
      data: {
        accountType: accountType,
        username: merchantName,
        totalSalesAmount: totalSalesAmount,
        totalVolumeSold: totalVolumeSold,
        totalCommissionsPaid: totalCommissionsPaid,
      }
    })
  } else {
    res.header({ status: 403 }).send({
      status: "Failed",
      message: "Not permitted to access this functionality"
    })
  }
}

const getRiderSummary = async (req, res) => {
  let userType = req.user.accountType;
  const riderId = req.params.riderId

  if (userType === "admin" || req.user.userId === req.params.riderId) {
    const allRiderTransactions = await Order.find({ dispatchId: riderId })
    let totalSalesAmount = 0;
    let totalVolumeSold = 0;
    let totalCommissionsPaid = 0;
    let riderName = allRiderTransactions[0].dispatchName
    let accountType = DISPATCH_RIDER;

    allRiderTransactions.forEach(transaction => {
      let dispatchCut = transaction.dispatchCut != null ? transaction.dispatchCut : "0"
      let quantity = transaction.quantity != null ? transaction.quantity : "0"
      let commission = transaction.jumgaDeliveryCut != null ? transaction.jumgaDeliveryCut : "0"
      totalSalesAmount += parseFloat(dispatchCut)
      totalVolumeSold += parseFloat(quantity)
      totalCommissionsPaid += parseFloat(commission)
    })

    res.header({ status: 200 }).send({
      status: "success",
      message: "Computed Successfully",
      data: {
        accountType: accountType,
        username: riderName,
        totalSalesAmount: totalSalesAmount,
        totalVolumeSold: totalVolumeSold,
        totalCommissionsPaid: totalCommissionsPaid,
      }
    })
  } else {
    res.header({ status: 403 }).send({
      status: "Failed",
      message: "Not permitted to access this functionality"
    })
  }
}

const getAllSalesJumga = async (req, res) => {
  if (req.user.accountType == ADMIN) {
    const allJumgaTransactions = await Order.find({});
    let totalCommisions = 0;

    allJumgaTransactions.forEach((transaction) => {
      let productCut = transaction.jumgaProductCut != null ? transaction.jumgaProductCut : "0";
      let deliveryCut = transaction.jumgaDeliveryCut != null ? transaction.jumgaDeliveryCut : "0";
      totalCommisions += (parseFloat(productCut) + parseFloat(deliveryCut))
    })
    res.header({ status: 200 }).send({
      status: "success",
      message: "successfully computed",
      data: {
        totalCommissionsEarned: totalCommisions,
      }
    })
  } else {
    res.header({ status: 403 }).send({
      status: "Failed",
      message: "Not permitted to access this functionality"
    })
  }
}


const completeRegistration = async (req, res) => {
  const newUserInfoList = await User.find({ _id: mongoose.Types.ObjectId(req.user.userId) }).select("-password")
  const newUserInfo = newUserInfoList[0]
  if (req.user.accountType === MERCHANT) {
    const defaultProductImageLink = "/uploads/shopping_bag.png"
    const dataBody = singlePaymentDataTemplate("20", "USD", req.user.userId,
      { name: newUserInfo.username, email: newUserInfo.accountEmail, phonenumber: "08002255443" },
      { customerId: req.user.userId, username: req.user.username, email: (newUserInfo.accountEmail).toString(), productImageLink: defaultProductImageLink, transactionType: "registration" });
    const response = await payRegistrationFee(dataBody);
    if (response == null) {
      res.header({ status: 400 }).send({
        status: 'failed',
        message: `Please login and complete payment to activate your account`
      });
    } else {
      res.header({ status: 200 }).send({
        status: "pay",
        message: "New Merchant Account was created succesfully",
        link: response
      });
    }
  } else {
    res.header({ status: 403 }).send({
      status: "failed",
      message: "Only merchants get to pay a registration fee"
    })
  }
}

const createOrder = async (transactionObj) => {
  const newOrder = await Order.create(transactionObj)
  return newOrder;
}


const processDirectSingleOrder = async (req, res) => {
  let userId = "";
  let username = ""
  let email = "test@gmail.com"
  if (req.user) {
    userId = req.user.userId;
    username = req.user.username;
    const user = await User.find({ _id: mongoose.Types.ObjectId(req.user.userId) });
    email = user[0].accountEmail;
  } else {
    userId = uuid.v4().split("-").join("");
    username = req.body.name == null ? "guest" : req.body.name
    email = req.body.email
  }
  const productId = req.body.productId;
  const quantity = req.body.quantity
  const transactionReference = uuid.v4().split("-").join("")

  const productList = await Product.find({ _id: mongoose.Types.ObjectId(productId) });
  const product = productList[0];
  const merchantList = await User.find({ _id: mongoose.Types.ObjectId(product.merchantId) })
  const merchant = merchantList[0];
  const dispatcherIdList = await MerchantDispatcher.find({ merchantIds: merchant._id.toString() }).select("dispatcherId")
  const dispatcherId = dispatcherIdList[0].dispatcherId;
  const dispatcherList = await User.find({ _id: mongoose.Types.ObjectId(dispatcherId) })
  const dispatcher = dispatcherList[0];
  const totalProductPrice = quantity * product.price;
  const totalDeliveryPrice = quantity * product.deliveryCost;
  const split = computeSplitOfOrder()

  const merchantSubAccount = {
    "id": merchant.subAccountIdKey,
    "transaction_charge_type": "flat_subaccount",
    "transaction_charge": totalProductPrice * split.merchantPercentage,
  };

  const riderSubAccount = {
    "id": dispatcher.subAccountIdKey,
    "transaction_charge_type": "flat_subaccount",
    "transaction_charge": totalDeliveryPrice * split.dispatchPercentage,
  }

  const customer = {
    userId,
    name: username,
    email,
  }

  const meta = {
    transactionType: "product",
    userId: userId,
    currencyCode: product.currencyCode,
    merchantId: merchant._id.toString(),
    merchantName: merchant.username,
    riderId: dispatcher._id.toString(),
    riderName: dispatcher.username,
    productId: product._id.toString(),
    productName: product.name,
    productImageLink: product.productImageLink,
    quantity: quantity.toString(),
    totalProductPricePaid: totalProductPrice.toString(),
    totalDeliveryPricePaid: (totalDeliveryPrice.toString()),
    jumgaDeliveryCut: (totalDeliveryPrice * split.jumgaDeliveryPercentage).toString(),
    jumgaProductCut: (totalProductPrice * split.jumgaProductPercentage.toString()),
    merchantCut: (totalProductPrice * split.merchantPercentage).toString(),
    dispatchCut: (totalDeliveryPrice * split.dispatchPercentage).toString(),
  }

  const requestBody = singleProductPaymentTemplate(
    transactionReference,
    totalDeliveryPrice + totalProductPrice,
    product.currencyCode,
    customer,
    meta,
    merchantSubAccount,
    riderSubAccount
  );

  const response = await buyProduct(requestBody);
  if (response == null) {
    res.header({ status: 400 }).send({
      status: 'failed',
      message: `We are unable to complete your purchase at this time`
    });
  } else {
    res.header({ status: 200 }).send({
      status: "pay",
      message: "Secure Link successfully generated",
      link: response
    });
  }
}

const processCartOrders = async (req, res) => {
  let userId = "";
  let username = ""
  let email = "test@gmail.com"
  if (req.user) {
    userId = req.user.userId;
    username = req.user.username;
    const user = await User.find({ _id: mongoose.Types.ObjectId(req.user.userId) });
    email = user[0].accountEmail;
  } else {
    userId = uuid.v4().split("-").join("");
    username = req.body.name == null ? "guest" : req.body.name
    email = (req.body.email == null) ? "test@gmail.com" : req.body.email
  }
  const productIdsAndQuantities = req.body.productIdsAndQuantities;
  const transactionReference = uuid.v4().split("-").join("")

  const customer = {
    userId,
    name: username,
    email,
  }

  const imageLinkStub = "http://" + req.headers.host;
  const metaAndSubAccounts = await getMetaAndSubAccountSplitForProductsInCart(productIdsAndQuantities, userId, imageLinkStub);
  let totalAmount = 0;
  metaAndSubAccounts.forEach((metaAndSubAcc) => {
    totalAmount += parseFloat(metaAndSubAcc.meta.totalAmount)
  });
  let subAccounts = []
  metaAndSubAccounts.forEach((metaAndSubAcc) => {
    subAccounts = subAccounts.concat(metaAndSubAcc.subAccountList);
  });
  subAccounts = reduceSubAccounts(subAccounts);
  const metaValue = metaAndSubAccounts.map((metaAndSubAcc) => {
    return metaAndSubAcc.meta;
  });

  const base64MetaValue = convertJSONToBase64(metaValue);

  const itemsAreSameCurrency = validateAllItemsAreSameCurrency(metaValue)
  if (!itemsAreSameCurrency) {
    res.header({ status: 403 }).send({
      status: "Failed",
      message: `We can only process bulk orders if the selected items are of the same currency type not mixed 
      i.e. ALL order items should either be in NGN or GBP or KES or GHS and not a mix of them.
      Unselect the offending items and try again`
    });
    return;
  }

  const requestBody = cartProductPaymentTemplate(
    transactionReference,
    totalAmount,
    metaAndSubAccounts[0].meta.currencyCode,
    customer,
    { transactionType: "cart", transactionInfo: base64MetaValue },
    subAccounts,
  );

  const response = await buyProduct(requestBody);

  if (response == null) {
    res.header({ status: 400 }).send({
      status: 'failed',
      message: `We are unable to complete your purchase at this time`
    });
  } else {
    res.header({ status: 200 }).send({
      status: "pay",
      message: "Secure Link successfully generated",
      link: response
    });
  }
}

const validateAllItemsAreSameCurrency = (items) => {
  if (items.length <= 1) {
    return true;
  }
  const checkCurrency = items[0].currencyCode;
  let dissimilarCurrencyCode = items.filter((item) => {
    return item.currencyCode != checkCurrency;
  })
  if (dissimilarCurrencyCode.length > 0) {
    return false
  } else { return true }
}

const getMetaAndSubAccountSplitForProductsInCart = async (productAndQtyDetails, userId, productImageLinkStub) => {
  const metaAndSubAccounts = await productAndQtyDetails.items.map(async (item) => {
    const productList = await Product.find({ _id: mongoose.Types.ObjectId(item.productId) });
    const product = productList[0];
    const merchantList = await User.find({ _id: mongoose.Types.ObjectId(product.merchantId) })
    const merchant = merchantList[0];
    const dispatcherIdList = await MerchantDispatcher.find({ merchantIds: merchant._id.toString() }).select("dispatcherId")
    const dispatcherId = dispatcherIdList[0].dispatcherId;
    const dispatcherList = await User.find({ _id: mongoose.Types.ObjectId(dispatcherId) })
    const dispatcher = dispatcherList[0];
    const totalProductPrice = item.quantity * product.price;
    const totalDeliveryPrice = item.quantity * product.deliveryCost;
    const cartId = item.cartId;
    const split = computeSplitOfOrder();

    const merchantSubAccount = {
      "id": merchant.subAccountIdKey,
      "transaction_charge_type": "flat_subaccount",
      "transaction_charge": totalProductPrice * split.merchantPercentage,
    };

    const riderSubAccount = {
      "id": dispatcher.subAccountIdKey,
      "transaction_charge_type": "flat_subaccount",
      "transaction_charge": totalDeliveryPrice * split.dispatchPercentage,
    }
    const subAccountList = [
      merchantSubAccount,
      riderSubAccount,
    ]
    const meta = {
      transactionType: "cart",
      cartId: cartId,
      userId: userId,
      currencyCode: product.currencyCode,
      merchantId: merchant._id.toString(),
      merchantName: merchant.username,
      riderId: dispatcher._id.toString(),
      riderName: dispatcher.username,
      productId: product._id.toString(),
      productName: product.name,
      productImageLink: product.productImageLink,
      quantity: item.quantity.toString(),
      totalAmount: (totalDeliveryPrice + totalProductPrice).toString(),
      totalProductPricePaid: totalProductPrice.toString(),
      totalDeliveryPricePaid: (totalDeliveryPrice.toString()),
      jumgaDeliveryCut: (totalDeliveryPrice * split.jumgaDeliveryPercentage).toString(),
      jumgaProductCut: (totalProductPrice * split.jumgaProductPercentage.toString()),
      merchantCut: (totalProductPrice * split.merchantPercentage).toString(),
      dispatchCut: (totalDeliveryPrice * split.dispatchPercentage).toString(),
    }
    return { subAccountList: subAccountList, meta: meta }
  })
  return Promise.all(metaAndSubAccounts);
}

const reduceSubAccounts = (subAccountsArr) => {
  const reducedSubAccounts = [];
  const repeatedSubAccountKeys = subAccountsArr.map(subAccount => {
    return subAccount.id;
  })
  const subAccountKeys = [...new Set(repeatedSubAccountKeys)]
  for (let i = 0; i < subAccountKeys.length; i++) {
    let newSubAcc = {
      "id": subAccountKeys[i],
      "transaction_charge_type": "flat_subaccount",
    }
    let totalAmount = 0
    for (let j = 0; j < subAccountsArr.length; j++) {
      if (subAccountKeys[i] === subAccountsArr[j].id) {
        totalAmount += subAccountsArr[j].transaction_charge;
      }
    }
    newSubAcc.transaction_charge = totalAmount;
    reducedSubAccounts.push(newSubAcc);
  }
  return (reducedSubAccounts);
}

const verifyPayment = async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const transactionId = queryObject.transaction_id;
  const value = await verifyPaymentAccount(transactionId)
  if (value.status === "success") {
    if (value.data.meta.transactionType == "registration") {
      const transactionObject = getTemplateForRegistrationOrder(value);
      await createOrder(transactionObject)
      await User.updateOne({ _id: mongoose.Types.ObjectId(value.data.tx_ref) }, { $set: { active: 1 } })
    } else if (value.data.meta.transactionType == "product") {
      const transactionObject = getTemplateForProductOrder(value);
      await createOrder(transactionObject)
    } else if (value.data.meta.transactionType == "cart") {
      const customerName = value.data.customer.name;
      const transactionId = value.data.id;
      const transactionRef = value.data.tx_ref;
      const base64EncodedMeta = value.data.meta.transactionInfo;
      const metaArray = convertBase64ToJSON(base64EncodedMeta);
      for (let i = 0; i < metaArray.length; i++) {
        let cartId = mongoose.Types.ObjectId(metaArray[i].cartId)
        let transactionObject = getTemplateForCartProductOrder(metaArray[i], transactionId, transactionRef, customerName);
        await createOrder(transactionObject);
        await Cart.deleteOne({ _id: cartId })
      }
    }
  }
  res.header({ status: 200 }).render("payment_successful")
}

const getTemplateForProductOrder = (value) => {
  let transactionObject = {
    transationId: value.data.id,
    transactionRef: value.data.tx_ref,
    userId: value.data.meta.userId,
    currencyCode: value.data.meta.currencyCode,
    transactionType: value.data.meta.transactionType,
    merchantId: value.data.meta.merchantId,
    productImageLink: value.data.meta.productImageLink,
    merchantName: value.data.meta.merchantName,
    dispatchId: value.data.meta.riderId,
    dispatchName: value.data.meta.riderName,
    productId: value.data.meta.productId,
    productName: value.data.meta.productName,
    quantity: value.data.meta.quantity,
    totalProductPricePaid: value.data.amount,
    totalDeliveryPricePaid: value.data.meta.totalDeliveryPricePaid,
    jumgaDeliveryCut: value.data.meta.jumgaDeliveryCut,
    jumgaProductCut: value.data.meta.jumgaProductCut,
    merchantCut: value.data.meta.merchantCut,
    dispatchCut: value.data.meta.dispatchCut,
    buyerName: value.data.customer.name,
    buyerPhone: "N/A",
  }
  return transactionObject;
}

const getTemplateForCartProductOrder = (value, transactionId, transactionRef, customerName) => {
  let transactionObject = {
    transationId: transactionId,
    transactionRef: transactionRef,
    userId: value.userId,
    currencyCode: value.currencyCode,
    transactionType: value.transactionType,
    merchantId: value.merchantId,
    merchantName: value.merchantName,
    productImageLink: value.productImageLink,
    quantity: value.quantity,
    dispatchId: value.riderId,
    dispatchName: value.riderName,
    productId: value.productId,
    productName: value.productName,
    totalProductPricePaid: value.totalAmount,
    totalDeliveryPricePaid: value.totalDeliveryPricePaid,
    jumgaDeliveryCut: value.jumgaDeliveryCut,
    jumgaProductCut: value.jumgaProductCut,
    merchantCut: value.merchantCut,
    dispatchCut: value.dispatchCut,
    buyerName: customerName,
    buyerPhone: "N/A",
  }
  return transactionObject;
}

const getTemplateForRegistrationOrder = (value) => {
  let transactionObject = {
    transationId: value.data.id,
    transactionRef: value.data.tx_ref,
    transactionType: value.data.meta.transactionType,
    merchantId: value.data.meta.customer_id,
    userId: value.data.meta.customer_id,
    quantity: "1",
    merchantName: value.data.meta.username,
    productImageLink: value.data.meta.productImageLink,
    dispatchId: "N/A",
    dispatchName: "N/A",
    productId: "N/A",
    productName: "Registration Fee",
    totalProductPricePaid: value.data.amount,
    totalDeliveryPricePaid: "0",
    jumgaDeliveryCut: "0",
    jumgaProductCut: "0",
    merchantCut: value.data.merchant_fee,
    dispatchCut: "0",
    buyerName: value.data.meta.username,
    buyerPhone: "N/A",
  }
  return transactionObject;
}

const paymentRedirect = (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.header({ status: 200 }).send({ status: 200 })
}

const convertJSONToBase64 = (jsonObj) => {
  const base64String = Buffer.from(JSON.stringify(jsonObj)).toString('base64')
  return base64String;
}

const convertBase64ToJSON = (base64String) => {
  const stringData = Buffer.from(base64String, 'base64').toString('ascii');
  return JSON.parse(stringData);
}

module.exports = {
  processDirectSingleOrder,
  processCartOrders,
  getAllOrders,
  createOrder,
  verifyPayment,
  paymentRedirect,
  completeRegistration,
  getMerchantSummary,
  getRiderSummary,
  getAllSalesJumga,
};
