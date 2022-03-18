const mongoose = require("mongoose");
const { Schema } = mongoose;

const feeSchema = new Schema(
  {
    feeID: String,
    feeCurrency: String,
    feeLocale: String,
    feeEntity: String,
    entityProperty: String,
    feeType: String,
    feeValue: String,
  },
  { timestamps: true }
);

const Fee = mongoose.model("Fee", feeSchema);

module.exports = Fee;
