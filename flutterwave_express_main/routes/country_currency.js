var express = require('express');
var router = express.Router();
const { getCountryCodes, getCurrencyCodes, getAllBanksWithCodesByCountryCode } = require("../models/country_currency/CountryCurrencyService");

router.get('/country-codes', getCountryCodes);

router.get('/currency-codes', getCurrencyCodes);

router.get('/bank-codes/:code', getAllBanksWithCodesByCountryCode)

module.exports = router;
