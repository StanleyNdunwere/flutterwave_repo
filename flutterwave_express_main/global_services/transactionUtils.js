const axios = require("axios");
const { MERCHANT, DISPATCH_RIDER } = require("./UserUtils");


const createSubAccount = async (bankCode, accountNumber, accName, accEmail, countryCode, accountType) => {
  const split = computeSplitOfOrder();
  let percentageValue = 0;
  if (accountType === MERCHANT) {
    percentageValue = split.jumgaProductPercentage
  } else if (accountType === DISPATCH_RIDER) {
    percentageValue = split.jumgaDeliveryPercentage;
  }
  const subAccountObj = {
    account_bank: bankCode,
    account_number: accountNumber,
    business_name: accName,
    business_email: accEmail,
    business_contact: "Anonymous",
    business_contact_mobile: "0990890382",
    business_mobile: "09087930450",
    country: countryCode,
    meta: [{ accountType: accountType }],
    split_type: "percentage",
    split_value: percentageValue
  };

  const secret = process.env.flutterwaveSecret;
  const baseUrlFlutterwave = "https://api.flutterwave.com/v3/subaccounts/"
  try {
    const response = await axios({
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + secret,
      },
      url: baseUrlFlutterwave,
      data: subAccountObj,
    });

    return response.data.data;
  } catch (err) {
    return null;
  }
}

const removeSubAccount = async (subAccountId) => {
  const secret = process.env.flutterwaveSecret;
  const baseUrlFlutterwave = "https://api.flutterwave.com/v3/subaccounts/";
  try {
    const response = await axios.delete(baseUrlFlutterwave + subAccountId.toString(), {
      headers: {
        Authorization: 'Bearer ' + secret,
      }
    });
    return response.data;
  } catch (err) {
    return {};
  }
}


const fetchSubAccount = async (subAccountId) => {
  const secret = process.env.flutterwaveSecret;
  const baseUrlFlutterwave = "https://api.flutterwave.com/v3/subaccounts/"
  try {
    const response = await axios.get(baseUrlFlutterwave + subAccountId.toString(), {
      headers: {
        Authorization: 'Bearer ' + secret,
      }
    })
    return response.data
  } catch (err) {
    return [];
  }
}

const fetchAllSubAccounts = async (res) => {
  const secret = process.env.flutterwaveSecret;
  const baseUrlFlutterwave = "https://api.flutterwave.com/v3/subaccounts/"
  try {
    const response = await axios.get(baseUrlFlutterwave, {
      headers: {
        Authorization: 'Bearer ' + secret,
      }
    })
    return response.data
  } catch (err) {
    return [];
  }
}

const computeSplitOfOrder = () => {
  const sampleData = {
    price: 2000,
    delivery: 150,
    dispatchRider: 120,
    merchant: 1950,
    jumgaProduct: 50,
    jumgaDelivery: 30,
  }

  const jumgaProductPercentage = (sampleData.jumgaProduct) / (sampleData.price);
  const merchantPercentage = (sampleData.merchant) / (sampleData.price);
  const dispatchPercentage = (sampleData.dispatchRider) / (sampleData.delivery);
  const jumgaDeliveryPercentage = (sampleData.jumgaDelivery) / (sampleData.delivery);
  const splitPercentage = {
    jumgaProductPercentage,
    jumgaDeliveryPercentage,
    dispatchPercentage,
    merchantPercentage
  }
  return splitPercentage;
}


const payRegistrationFee = async (bodyData) => {
  const secret = process.env.flutterwaveSecret;
  const baseUrlFlutterwave = "https://api.flutterwave.com/v3/payments"
  try {
    const response = await axios({
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + secret,
        "Content-Type": "application/json"
      },
      url: baseUrlFlutterwave,
      data: bodyData,
    });
    return response.data.data.link
  } catch (err) {
    return null;
  }
}

const buyProduct = async (bodyData) => {
  const secret = process.env.flutterwaveSecret;
  const baseUrlFlutterwave = "https://api.flutterwave.com/v3/payments"
  try {
    const response = await axios({
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + secret,
        "Content-Type": "application/json"
      },
      url: baseUrlFlutterwave,
      data: bodyData,
    });
    return response.data.data.link
  } catch (err) {
    return null;
  }
}

const verifyPaymentAccount = async (transactionId) => {
  const secret = process.env.flutterwaveSecret;
  const baseUrlFlutterwave = "https://api.flutterwave.com/v3/transactions/" + transactionId + "/verify"
  try {
    const response = await axios.get(baseUrlFlutterwave, {
      headers: {
        Authorization: 'Bearer ' + secret,
      }
    })
    return response.data
  } catch (err) {
    return [];
  }
}


const singlePaymentDataTemplate = (amount, currencyCode, transactionRef, customerData, meta) => {
  let body = {
    "tx_ref": transactionRef,
    "amount": amount,
    "currency": currencyCode,
    "redirect_url": process.env.baseUrl + "/orders/payment",
    "payment_options": "card",
    "meta": meta,
    "customer": customerData,
    "customizations": {
      "title": "Jumga Payments",
      "description": "Complete your Order",
      "logo": process.env.baseUrl + "/uploads/logo_payment.png"
    }
  }
  return body;
}

const singleProductPaymentTemplate = (transactionRef, totalAmount, currencyCode, customer, meta, subAccountMerchant, subAccountRider) => {
  const transData = {
    "tx_ref": transactionRef,
    "amount": totalAmount,
    "currency": currencyCode,
    "redirect_url": process.env.baseUrl + "/orders/payment",
    "payment_options": "card,ussd,barter",
    "customer": customer,
    "meta": meta,
    "subaccounts": [
      subAccountMerchant,
      subAccountRider,
    ],
    "customizations": {
      "title": "Jumga Store",
      "description": "Complete Your Order",
      "logo": process.env.baseUrl + "/uploads/logo_payment.png"
    }
  };
  return transData;
}

const cartProductPaymentTemplate = (transactionRef, totalAmount, currencyCode, customer, meta, subAccount) => {
  const transData = {
    "tx_ref": transactionRef,
    "amount": totalAmount,
    "currency": currencyCode,
    "redirect_url": process.env.baseUrl + "/orders/payment",
    "payment_options": "card,ussd,barter",
    "customer": customer,
    "meta": meta,
    "subaccounts": subAccount,
    "customizations": {
      "title": "Jumga Store",
      "description": "Complete Your Order",
      "logo": process.env.baseUrl + "/uploads/logo_payment.png"
    }
  };
  return transData;
}

module.exports = {
  removeSubAccount,
  buyProduct,
  createSubAccount,
  fetchAllSubAccounts,
  fetchSubAccount,
  computeSplitOfOrder,
  payRegistrationFee,
  singlePaymentDataTemplate,
  verifyPaymentAccount,
  singleProductPaymentTemplate,
  cartProductPaymentTemplate,
}