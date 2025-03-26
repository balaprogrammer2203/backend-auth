const { check } = require('express-validator');
const {inputValidationMiddleware} = require("../../../middlewares/customValidations");

const logoutValidation = [

  check("refresh_token")
    .not()
    .isEmpty()
    .withMessage("refresh_token cannot be empty"),

    inputValidationMiddleware
  ];

module.exports = {
  logoutValidation
}