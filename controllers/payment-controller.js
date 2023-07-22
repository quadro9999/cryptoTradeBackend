const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const currencyService = require("../service/currency-service");

class PaymentController {
  async getCurrency(req, res, next) {
    let currency = await currencyService.getCurrency();

    return res.json(currency);
  }
}

module.exports = new PaymentController();
