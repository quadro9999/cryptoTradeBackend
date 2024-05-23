const { Schema, model } = require("mongoose");

const DepositSchema = new Schema({
  userID: { type: String, required: true },
  username: { type: String, required: true },
  balanceUSD: { type: Number, default: 0 },
  balanceBTC: { type: Number, default: 0 },
  balanceUSDT: { type: Number, default: 0 },
  balanceBUSD: { type: Number, default: 0 },
  balanceATOM: { type: Number, default: 0 },
  balanceBCH: { type: Number, default: 0 },
  balanceBNB: { type: Number, default: 0 },
  balanceSOL: { type: Number, default: 0 },
  balanceTRX: { type: Number, default: 0 },
  balanceETH: { type: Number, default: 0 },
  sumToPay: { type: Number, required: true },
  chosedTokens: { type: String, required: true },
  walletNumber: { type: String },
});

module.exports = model("DepositRequests", DepositSchema);
