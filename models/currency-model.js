const { Schema, model } = require("mongoose");

const CurrencySchema = new Schema({
  currency: { type: JSON },
});

module.exports = model("Currency", CurrencySchema);
