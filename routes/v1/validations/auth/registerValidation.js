const { check } = require('express-validator');
const {inputValidationMiddleware} = require("../../../../middlewares/customValidations");

const registerValidation = [

  check("username")
    .not()
    .isEmpty()
    .withMessage("username cannot be empty")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('A valid username with minimum 3 letter is required'),

  check("password")
    .not()
    .isEmpty()
    .withMessage("password cannot be empty")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage('A valid password with minimum 6 letter is required'),

  check("email")
    .not()
    .isEmpty()
    .withMessage("email cannot be empty")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('A valid email address is required'),

  // check("confirmpassword")
  //   .not()
  //   .isEmpty()
  //   .withMessage("confirm password cannot be empty")
  //   .custom((value, { req }) => value === req.body.password)
  //   .withMessage("compare password must match with password field"),

    inputValidationMiddleware
  ];

module.exports = {
  registerValidation
}