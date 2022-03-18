let router = require("express").Router();
const Fee = require("../models/fees.model");

router.post("/fees", (req, res) => {
  const feeSpecs = [];
  const pattern =
    /^(?<feeID>LNPY\d{4,}) (?<feeCurrency>[A-Z]+) (?<feeLocale>LOCL|INTL|\*) (?<feeEntity>CREDIT-CARD|DEBIT-CARD|BANK-ACCOUNT|USSD|WALLET-ID|\*)\((?<entityProperty>\*|[A-z]+)\) : APPLY (?<feeType>PERC|FLAT_PERC|FLAT) (?<feeValue>(\d+.?\d*:\d+.?\d+|\d+.?\d*))$/g;

  const specs = req.body.FeeConfigurationSpec.split("\\n");
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
});

module.exports = router;
