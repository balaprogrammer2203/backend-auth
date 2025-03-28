const { check } = require('express-validator');
const {inputValidationMiddleware} = require("../../../../middlewares/customValidations");

const updateUserValidation = [

    check("username")
        .not()
        .isEmpty()
        .withMessage("username cannot be empty")
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A valid username with minimum 3 letter is required'),

    check("email")
        .not()
        .isEmpty()
        .withMessage("email cannot be empty")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('A valid email address is required'),

    inputValidationMiddleware
];

module.exports = {
    updateUserValidation
}