const Fee = require("../models/fees.model");
const countryMap = require("../shared/country_currency_map.json");

exports.uploadFees = (req, res) => {
  const feeSpecs = [];
  const pattern =
    /^(?<feeID>LNPY\d{4,}) (?<feeCurrency>[A-Z]+) (?<feeLocale>LOCL|INTL|\*) (?<feeEntity>CREDIT-CARD|DEBIT-CARD|BANK-ACCOUNT|USSD|WALLET-ID|\*)\((?<entityProperty>\*|[A-z]+)\) : APPLY (?<feeType>PERC|FLAT_PERC|FLAT) (?<feeValue>(\d+.?\d*:\d+.?\d+|\d+.?\d*))$/g;

  const specs = req.body.FeeConfigurationSpec.split("\n");
  for (const spec of specs) {
    let match = pattern.exec(spec);
    do {
      feeSpecs.push(match.groups);
    } while ((match = pattern.exec(spec)) !== null);
  }

  Fee.insertMany(feeSpecs, function (err) {
    if (err) {
      res.status(500).json({ message: "There was an error on the server." });
    }
    res.json({ status: "ok" });
  });
};

exports.computeFee = async (req, res) => {
  let AppliedFeeID = "",
    AppliedFeeValue = 0.0,
    ChargeAmount = 0.0,
    SettlementAmount = 0.0;

  const amount = req.body.Amount;
  const bearsFee = req.body.Customer.BearsFee;
  let flat, perc;

  //get the currency
  var currency = req.body.Currency;
  // get the locale
  const currencyCountry = req.body.CurrencyCountry;
  const locale = countryMap[currencyCountry] === currency ? "LOCL" : "INTL";
  // get the fee entity
  const feeEntity = req.body.PaymentEntity.Type;
  // get the fee entity property
  const entityProperty = req.body.PaymentEntity.Issuer;

  const fee = await Fee.findOne()
    .where("feeCurrency")
    .in([currency, "*"])
    .where("feeLocale")
    .in([locale, "*"])
    .where("feeEntity")
    .in([feeEntity, "*"])
    .where("entityProperty")
    .in([entityProperty, "*"])
    .sort({
      entityProperty: -1,
      feeLocale: -1,
      feeEntity: -1,
      feeCurrency: -1,
    });

  if (!fee) {
    return res.status(400).json({
      Error: "No fee configuration is applicable to this transaction.",
    });
  }

  AppliedFeeID = fee.feeID;

  switch (fee.feeType) {
    case "FLAT":
      AppliedFeeValue = Math.round(parseFloat(fee.feeValue));
      break;
    case "PERC":
      AppliedFeeValue = Math.round(
        parseFloat((parseFloat(fee.feeValue) / 100) * amount)
      );
      break;
    default:
      let val = fee.feeValue.split(":");
      flat = parseFloat(val[0]); //flat value
      perc = parseFloat(val[1]); //percentage value
      AppliedFeeValue = Math.round(flat + (perc / 100) * parseFloat(amount));

    //flat_perc
  }

  if (bearsFee) {
    ChargeAmount = Math.round(amount + AppliedFeeValue);
  } else {
    ChargeAmount = Math.round(amount);
  }

  SettlementAmount = Math.round(ChargeAmount - AppliedFeeValue);

  return res.json({
    AppliedFeeID,
    AppliedFeeValue,
    ChargeAmount,
    SettlementAmount,
  });
};
