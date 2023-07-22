const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const DepositModel = require("../models/deposit-model");
const currencyService = require("./currency-service");
const depositModel = require("../models/deposit-model");
const userService = require("./user-service");
const userModel = require("../models/user-model");

class AdminService {
  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
  async getAllDepositRequests() {
    const deposits = await DepositModel.find();
    return deposits;
  }

  async topUpBalance(username, sumUSD, token) {
    let user = await userModel.findOne({ username: username });
    if (!user) {
      throw ApiError.BadRequest(404, "user not found");
    }

    let balanceRequest = await depositModel.findOneAndRemove({
      userID: user._id,
    });

    let currency = await currencyService.getCurrency();
    const BTCPrice = currency.BTC;
    const USDTPrice = currency.USDT;
    const BUSDPrice = currency.BUSD;
    if (token == "BTC") {
      let BTCbalance = sumUSD / BTCPrice;
      user.balanceBTC += BTCbalance;
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
      };
    } else if (token == "USDT") {
      let balanceUSDT = sumUSD / USDTPrice;
      user.balanceUSDT += balanceUSDT;
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
      };
    } else if (token == "BUSD") {
      let balanceBUSD = sumUSD / BUSDPrice;
      user.balanceBUSD += balanceBUSD;
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
      };
    }
  }

  async withdrawBalance(username, sumUSD, token) {
    let user = await userModel.findOne({ username: username });
    if (!user) {
      throw ApiError.BadRequest(404, "user not found");
    }
    let balanceRequest = await depositModel.findOneAndRemove({
      userID: user._id,
    });
    let currency = await currencyService.getCurrency();
    const BTCPrice = currency.BTC;
    const USDTPrice = currency.USDT;
    const BUSDPrice = currency.BUSD;
    if (token == "BTC") {
      let BTCbalance = sumUSD / BTCPrice;
      user.balanceBTC -= BTCbalance;
      if (user.balanceBTC < 0) {
        user.balanceBTC = 0;
      }
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
      };
    } else if (token == "USDT") {
      let balanceUSDT = sumUSD / USDTPrice;
      user.balanceUSDT -= balanceUSDT;
      if (user.balanceUSDT < 0) {
        user.balanceUSDT = 0;
      }
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
      };
    } else if (token == "BUSD") {
      let balanceBUSD = sumUSD / BUSDPrice;
      user.balanceBUSD -= balanceBUSD;
      if (user.balanceBUSD < 0) {
        user.balanceBUSD = 0;
      }
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
      };
    }
  }
}

module.exports = new AdminService();
