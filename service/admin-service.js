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
    const BNBPrice = currency.BNB;
    const ETHPrice = currency.ETH;
    const ATOMPrice = currency.ATOM;
    const BCHPrice = currency.BCH;
    const SOLPrice = currency.SOL;
    const TRXPrice = currency.TRX;
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
    } else if (token == "BNB") {
      let balanceBNB = sumUSD / BNBPrice;
      user.balanceBNB += balanceBNB;
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "BCH") {
      let balanceBCH = sumUSD / BCHPrice;
      user.balanceBCH += balanceBCH;
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "ETH") {
      let balanceETH = sumUSD / ETHPrice;
      user.balanceETH += balanceETH;
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "ATOM") {
      let balanceATOM = sumUSD / ATOMPrice;
      user.balanceATOM += balanceATOM;
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "SOL") {
      let balanceSOL = sumUSD / SOLPrice;
      user.balanceSOL += balanceSOL;
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "TRX") {
      let balanceTRX = sumUSD / TRXPrice;
      user.balanceTRX += balanceTRX;
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
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
    const BNBPrice = currency.BNB;
    const ETHPrice = currency.ETH;
    const ATOMPrice = currency.ATOM;
    const BCHPrice = currency.BCH;
    const SOLPrice = currency.SOL;
    const TRXPrice = currency.TRX;
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
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
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
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
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
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "BNB") {
      let balanceBNB = sumUSD / BNBPrice;
      user.balanceBNB -= balanceBNB;
      if (user.balanceBNB < 0) {
        user.balanceBNB = 0;
      }
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "BCH") {
      let balanceBCH = sumUSD / BCHPrice;
      user.balanceBCH -= balanceBCH;
      if (user.balanceBCH < 0) {
        user.balanceBCH = 0;
      }
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "ETH") {
      let balanceETH = sumUSD / ETHPrice;
      user.balanceETH -= balanceETH;
      if (user.balanceETH < 0) {
        user.balanceETH = 0;
      }
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "ATOM") {
      let balanceATOM = sumUSD / ATOMPrice;
      user.balanceATOM -= balanceATOM;
      if (user.balanceATOM < 0) {
        user.balanceATOM = 0;
      }
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "SOL") {
      let balanceSOL = sumUSD / SOLPrice;
      user.balanceSOL -= balanceSOL;
      if (user.balanceSOL < 0) {
        user.balanceSOL = 0;
      }
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    } else if (token == "TRX") {
      let balanceTRX = sumUSD / TRXPrice;
      user.balanceTRX -= balanceTRX;
      if (user.balanceTRX < 0) {
        user.balanceTRX = 0;
      }
      await user.save();
      return {
        btc: user.balanceBTC,
        usdt: user.balanceUSDT,
        busd: user.balanceBUSD,
        bnb: user.balanceBNB,
        atom: user.balanceATOM,
        eth: user.balanceETH,
        sol: user.balanceSOL,
        trx: user.balanceTRX,
        bch: user.balanceBCH,
      };
    }
  }
}

module.exports = new AdminService();
