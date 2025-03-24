const { check, validationResult } = require('express-validator');
const customError = require('../utils/customError');
// const createError = require('http-errors')

const formattedValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.path
        };
    },
});

const inputValidationMiddleware = (req, res, next) => {
    const errors = formattedValidationResult(req);

    if (!errors.isEmpty()) {
        // console.log("validation", errors.array())
        return next(customError(400, "Validation Error", { errors: errors.array() }));
    } else {
        next();
    }
}

module.exports = {
    inputValidationMiddleware,
};

