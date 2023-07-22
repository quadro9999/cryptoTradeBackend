const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const DepositModel = require("../models/deposit-model");
const currencyModel = require("../models/currency-model");

class CurrencyService {
  async getCurrencyFromApi() {
    const axios = require("axios");
    let response = null;
    let currency = await new Promise(async (resolve, reject) => {
      try {
        response = await axios.get(
          "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,USDT,BUSD",
          {
            headers: {
              "X-CMC_PRO_API_KEY": "6e285a84-bc91-480a-84f4-271fe5a4f528",
            },
          }
        );
      } catch (ex) {
        response = null;
        // error
        reject(ex);
      }
      if (response) {
        // success
        const json = response.data;
        resolve(json);
      }
    });

    let deleteCurrency = await currencyModel.remove();

    let createNewCurrency = await currencyModel.create({
      currency: currency,
    });

    return currency;
  }

  async getCurrency() {
    let currency = await currencyModel.findOne();
    let returnData = {
      BTC: currency.currency.data.BTC.quote.USD.price,
      USDT: currency.currency.data.USDT.quote.USD.price,
      BUSD: currency.currency.data.BUSD.quote.USD.price,
    };

    return returnData;
  }
}

module.exports = new CurrencyService();
