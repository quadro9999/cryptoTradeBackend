const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const adminService = require("../service/admin-service");
const tokenService = require("../service/token-service");
const userModel = require("../models/user-model");

class AdminController {
  async getAllUsers(req, res, next) {
    let users = await adminService.getAllUsers();
    return res.json(users);
  }

  async getAllDepositRequest(req, res, next) {
    let deposits = await adminService.getAllDepositRequests();
    return res.json(deposits);
  }

  async topUpBalance(req, res, next) {
    const { username, sumUSD, token } = req.body;

    let balance = await adminService.topUpBalance(username, sumUSD, token);
    return res.json(balance);
  }

  async withdrawBalance(req, res, next) {
    const { username, sumUSD, token } = req.body;

    let balance = await adminService.withdrawBalance(username, sumUSD, token);
    return res.json(balance);
  }
}

module.exports = new AdminController();
