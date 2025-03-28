const { check } = require('express-validator');
const {inputValidationMiddleware} = require("../../../../middlewares/customValidations");

const loginValidation = [

  check("username")
    .not()
    .isEmpty()
    .withMessage("username cannot be empty"),

  check("password")
    .not()
    .isEmpty()
    .withMessage("password cannot be empty"),

    inputValidationMiddleware
  ];

module.exports = {
    loginValidation
}