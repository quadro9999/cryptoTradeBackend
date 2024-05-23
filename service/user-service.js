const UserModel = require("../models/user-model");

const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const currencyService = require("./currency-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const depositModel = require("../models/deposit-model");

class UserService {
  async registration(username, email, password, verification) {
    const candidateUsername = await UserModel.findOne({ username });
    if (candidateUsername) {
      throw ApiError.BadRequest(`Username ${username} is already taken`);
    }
    const candidateEmail = await UserModel.findOne({ email });
    if (candidateEmail) {
      throw ApiError.BadRequest(
        `Account with email ${email} is alredy existed`
      );
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

    const user = await UserModel.create({
      username,
      email,
      password: hashPassword,
      activationLink,
      verification: 0,
      verification_sum: 100,
    });

    // подтверждение по емейл
    try {
      await mailService.sendActivationMail(
        email,
        `${process.env.API_URL}/api/activate/${activationLink}`
      );
    } catch (error) {
      console.log(error);
    }

    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Invalid activation link");
    }
    user.isActivated = true;
    await user.save();
  }

  async verify(user) {
    let newUser = await UserModel.findOneAndUpdate(
      { _id: user.id },
      { verification: 1 }
    );
    if (!newUser) {
      throw ApiError.BadRequest(`Username ${username} not found`);
    }
    return newUser.verification;
  }

  async login(username, password) {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw ApiError.BadRequest(`Username ${username} not found`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Invalid password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async checkAuth(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader.split(" ")[1];
    const userData = tokenService.validateAccessToken(accessToken);
    const user = await UserModel.findById(userData.id);
    return user;
  }

  async cancelregistration(req) {
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader.split(" ")[1];
    const userData = tokenService.validateAccessToken(accessToken);
    let deleteuser = await UserModel.findByIdAndRemove(userData.id);
    return true;
  }

  async transferCoins(user, sum, coinFrom, coinTo) {
    let currency = await currencyService.getCurrency();
    let usdSum = 0;
    let finnalySum = 0;

    // transfer coin to USD
    if (coinFrom == "BTC") {
      if (user.balanceBTC <= sum) {
        throw ApiError.BadRequest("Not enough BTC to transfer");
      }
      usdSum = sum * currency.BTC;
      user.balanceBTC = user.balanceBTC - sum;
    } else if (coinFrom == "USDT") {
      if (user.balanceUSDT <= sum) {
        throw ApiError.BadRequest("Not enough USDT to transfer");
      }
      usdSum = sum * currency.USDT;
      user.balanceUSDT = user.balanceUSDT - sum;
    } else if (coinFrom == "BUSD") {
      if (user.balanceBUSD <= sum) {
        throw ApiError.BadRequest("Not enough BUSD to transfer");
      }
      usdSum = sum * currency.BUSD;
      user.balanceBUSD = user.balanceBUSD - sum;
    } else if (coinFrom == "ATOM") {
      if (user.balanceATOM <= sum) {
        throw ApiError.BadRequest("Not enough ATOM to transfer");
      }
      usdSum = sum * currency.ATOM;
      user.balanceATOM = user.balanceATOM - sum;
    } else if (coinFrom == "BCH") {
      if (user.balanceBCH <= sum) {
        throw ApiError.BadRequest("Not enough BCH to transfer");
      }
      usdSum = sum * currency.BCH;
      user.balanceBCH = user.balanceBCH - sum;
    } else if (coinFrom == "BNB") {
      if (user.balanceBNB <= sum) {
        throw ApiError.BadRequest("Not enough BNB to transfer");
      }
      usdSum = sum * currency.BNB;
      user.balanceBNB = user.balanceBNB - sum;
    } else if (coinFrom == "SOL") {
      if (user.balanceSOL <= sum) {
        throw ApiError.BadRequest("Not enough SOL to transfer");
      }
      usdSum = sum * currency.SOL;
      user.balanceSOL = user.balanceSOL - sum;
    } else if (coinFrom == "TRX") {
      if (user.balanceTRX <= sum) {
        throw ApiError.BadRequest("Not enough TRX to transfer");
      }
      usdSum = sum * currency.TRX;
      user.balanceTRX = user.balanceTRX - sum;
    } else if (coinFrom == "ETH") {
      if (user.balanceETH <= sum) {
        throw ApiError.BadRequest("Not enough ETH to transfer");
      }
      usdSum = sum * currency.ETH;
      user.balanceETH = user.balanceETH - sum;
    } else {
      throw ApiError.BadRequest("Choosed coinFrom not available");
    }

    // transfer USD to coin

    if (coinTo == "BTC") {
      finnalySum = usdSum / currency.BTC;
      user.balanceBTC = user.balanceBTC + finnalySum;
    } else if (coinTo == "USDT") {
      finnalySum = usdSum / currency.USDT;
      user.balanceUSDT = user.balanceUSDT + finnalySum;
    } else if (coinTo == "BUSD") {
      finnalySum = usdSum / currency.BUSD;
      user.balanceBUSD = user.balanceBUSD + finnalySum;
    } else if (coinTo == "ATOM") {
      finnalySum = usdSum / currency.ATOM;
      user.balanceATOM = user.balanceATOM + finnalySum;
    } else if (coinTo == "BCH") {
      finnalySum = usdSum / currency.BCH;
      user.balanceBCH = user.balanceBCH + finnalySum;
    } else if (coinTo == "BNB") {
      finnalySum = usdSum / currency.BNB;
      user.balanceBNB = user.balanceBNB + finnalySum;
    } else if (coinTo == "SOL") {
      finnalySum = usdSum / currency.SOL;
      user.balanceSOL = user.balanceSOL + finnalySum;
    } else if (coinTo == "TRX") {
      finnalySum = usdSum / currency.TRX;
      user.balanceTRX = user.balanceTRX + finnalySum;
    } else if (coinTo == "ETH") {
      finnalySum = usdSum / currency.ETH;
      user.balanceETH = user.balanceETH + finnalySum;
    } else {
      throw ApiError.BadRequest("Choosed coinTo not available");
    }

    await user.save();

    return { user };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async depositRequest(user, tokens, wallet, sum) {
    let userData = user;

    const depositRequest = await depositModel.create({
      userID: userData._id,
      username: userData.username,
      balanceUSD: userData.balanceUSD,
      balanceBUSD: userData.balanceBUSD,
      balanceUSDT: userData.balanceUSDT,
      balanceBTC: userData.balanceBTC,
      balanceATOM: userData.balanceATOM,
      balanceTRX: userData.balanceTRX,
      balanceSOL: userData.balanceSOL,
      balanceBNB: userData.balanceBNB,
      balanceBCH: userData.balanceBCH,
      balanceETH: userData.balanceETH,
      sumToPay: sum,
      chosedTokens: tokens,
      walletNumber: wallet,
    });

    return depositRequest;
  }
}

module.exports = new UserService();
