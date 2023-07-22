const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  activationLink: { type: String },
  balanceUSD: { type: Number, default: 0 },
  balanceBTC: { type: Number, default: 0 },
  balanceUSDT: { type: Number, default: 0 },
  balanceBUSD: { type: Number, default: 0 },
});

module.exports = model("User", UserSchema);
