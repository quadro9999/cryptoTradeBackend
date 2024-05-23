const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");
const UserModel = require("../models/user-model");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }
      const { username, email, password, verification } = req.body;
      const userData = await userService.registration(
        username,
        email,
        password
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async cancelregistration(req, res, next) {
    try {
      const responce = await userService.cancelregistration(req);
      return res.json(responce);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(`${process.env.CLIENT_URL}/cabinet`);
    } catch (e) {
      next(e);
    }
  }

  async verify(req, res, next) {
    try {
      let user = req.user;
      const verificationParam = await userService.verify(user);
      return res.json({ verify: verificationParam });
    } catch (error) {
      next(e);
    }
  }

  async checkAuth(req, res, next) {
    try {
      const user = await userService.checkAuth(req, res, next);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async depositRequest(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
      const accessToken = authorizationHeader.split(" ")[1];
      const userData = tokenService.validateAccessToken(accessToken);
      const user = await UserModel.findById(userData.id);
      const { tokens, wallet, sum } = req.body;
      const request = await userService.depositRequest(
        user,
        tokens,
        wallet,
        sum
      );
      return res.json(request);
    } catch (e) {
      next(e);
    }
  }

  async transferCoins(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
      const accessToken = authorizationHeader.split(" ")[1];
      const userData = tokenService.validateAccessToken(accessToken);
      const user = await UserModel.findById(userData.id);
      const { sum, coinFrom, coinTo } = req.body;
      const finnalySum = await userService.transferCoins(
        user,
        sum,
        coinFrom,
        coinTo
      );
      return res.json(finnalySum);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
