const { check } = require('express-validator');
const {inputValidationMiddleware} = require("../../../../middlewares/customValidations");

const refreshTokenValidation = [

  check("refresh_token")
    .not()
    .isEmpty()
    .withMessage("refresh_token cannot be empty"),

    inputValidationMiddleware
  ];

module.exports = {
  refreshTokenValidation
}