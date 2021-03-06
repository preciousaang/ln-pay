const { validationResult, check } = require("express-validator");
module.exports = {
  fees: async (req, res, next) => {
    await check("FeeConfigurationSpec")
      .notEmpty()
      .bail()
      .withMessage("Field is required")
      .replace("\\n", "\n")
      .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  computeFees: async (req, res, next) => {
    await check("ID")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isNumeric()
      .bail()
      .withMessage("Must be a number")
      .run(req);

    await check("Amount")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isNumeric()
      .bail()
      .withMessage("Must be a number")
      .run(req);

    await check("Currency")
      .notEmpty()
      .bail()
      .withMessage("Field is required")
      .toUpperCase()
      .isString()
      .bail()
      .withMessage("Must be a string")
      .run(req);

    await check("CurrencyCountry")
      .notEmpty()
      .bail()
      .withMessage("Field is required")
      .isString()
      .bail()
      .withMessage("Must be a string")
      .run(req);

    await check("Customer.ID")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isNumeric()
      .bail()
      .withMessage("Must be a number")
      .run(req);

    await check("Customer.EmailAddress")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isEmail()
      .bail()
      .withMessage("Must be a valid email")
      .run(req);

    await check("Customer.FullName")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isString()
      .bail()
      .withMessage("Must be a string")
      .run(req);

    await check("Customer.BearsFee")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isBoolean()
      .bail()
      .withMessage("Must be a boolean")
      .run(req);

    await check("PaymentEntity.ID")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isNumeric()
      .bail()
      .withMessage("Must be a number")
      .run(req);

    await check("PaymentEntity.Issuer")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isString()
      .bail()
      .withMessage("Must be a string")
      .run(req);

    await check("PaymentEntity.Brand")
      .isString()
      .bail()
      .withMessage("Must be a string")
      .run(req);

    await check("PaymentEntity.Number")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isString()
      .bail()
      .withMessage("Must be a string")
      .run(req);

    await check("PaymentEntity.SixID")
      .notEmpty()
      .bail()
      .withMessage("Required Field")

      .run(req);
    await check("PaymentEntity.Type")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isString()
      .bail()
      .withMessage("Must be a string")
      .run(req);

    await check("PaymentEntity.Country")
      .notEmpty()
      .bail()
      .withMessage("Required Field")
      .isString()
      .bail()
      .withMessage("Must be a string")
      .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
};
