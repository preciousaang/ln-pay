let router = require("express").Router();

router.post("/fees", (req, res) => {
  const feeSpec = req.body.FeeConfigurationSpec;
  console.log(feeSpec);
  res.status(200).json({ feeSpec });
});

module.exports = router;
