const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  verification: { type: Number, default: 0 },
  activationLink: { type: String },
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
  verification_sum: { type: Number, default: 100 },
  main_alert: { type: String, default: "null" },
});

module.exports = model("User", UserSchema);
