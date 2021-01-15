const axios = require("axios");
const { computeSplitOfOrder, fetchAllSubAccounts, fetchSubAccount, removeSubAccount } = require("../../global_services/transactionUtils")
const currencyCodes = {
  kenya: "KES",
  nigeria: "NGN",
  ghana: "GHS",
  uk: "GBP"
};

const getCountryCodes = (req, res) => {
  res.header({ status: 200 }).send({
    status: "success",
    data: {
      kenya: "KE",
      nigeria: "NG",
      ghana: "GH",
      uk: "UK"
    }
  });
}

const getCurrencyCodes = (req, res) => {
  res.header({ status: 200 }).send({
    status: "success",
    data: currencyCodes,
  });
}

const getAllBanksWithCodesByCountryCode = async (req, res) => {

  const secret = process.env.flutterwaveSecret;
  const bank = req.params.code;
  const baseUrlFlutterwave = "https://api.flutterwave.com/v3/banks/"

  try {
    const bankData = await axios.get(baseUrlFlutterwave + bank, {
      headers: {
        Authorization: 'Bearer ' + secret,
      }
    })
    res.header({ status: 200 }).send({
      status: "success",
      data: bankData.data
    })
  } catch (err) {
    res.haeder({ status: 403 }).send({
      status: "failed",
      data: [{ message: "Unable to fetchlist" }]
    })
  }
}

module.exports = {
  getCurrencyCodes,
  getCountryCodes,
  getAllBanksWithCodesByCountryCode,
  currencyCodes,
}