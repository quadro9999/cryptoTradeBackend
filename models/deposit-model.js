const { Schema, model } = require("mongoose");

const DepositSchema = new Schema({
  userID: { type: String, required: true },
  username: { type: String, required: true },
  balanceUSD: { type: Number, required: true },
  balanceBTC: { type: Number, required: true },
  balanceUSDT: { type: Number, required: true },
  balanceBUSD: { type: Number, required: true },
  sumToPay: { type: Number, required: true },
  chosedTokens: { type: String, required: true },
  walletNumber: { type: String },
});

module.exports = model("DepositRequests", DepositSchema);
