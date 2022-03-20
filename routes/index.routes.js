let router = require("express").Router();
const feesController = require("../controllers/feesController");
const validators = require("../validators");

router.post("/fees", validators.fees, feesController.uploadFees);
router.post(
  "/compute-transaction-fee",
  validators.computeFees,
  feesController.computeFees
);

module.exports = router;
