const UserModel = require("../models/user-model");

const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const depositModel = require("../models/deposit-model");

class UserService {
  async registration(username, email, password) {
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
    });

    // подтверждение по емейл
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

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
    console.log(deleteuser);
    return true;
  }

  // async refresh(refreshToken) {
  //   if (!refreshToken) {
  //     throw ApiError.UnauthorizedError();
  //   }
  //   const userData = tokenService.validateRefreshToken(refreshToken);
  //   const tokenFromDb = await tokenService.findToken(refreshToken);
  //   if (!userData || !tokenFromDb) {
  //     throw ApiError.UnauthorizedError();
  //   }
  //   const user = await UserModel.findById(userData.id);
  //   const userDto = new UserDto(user);
  //   const tokens = tokenService.generateTokens({ ...userDto });

  //   await tokenService.saveToken(userDto.id, tokens.refreshToken);
  //   return { ...tokens, user: userDto };
  // }

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
      sumToPay: sum,
      chosedTokens: tokens,
      walletNumber: wallet,
    });

    return depositRequest;
  }
}

module.exports = new UserService();
