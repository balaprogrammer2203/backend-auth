const createError = require('http-errors')

const errorCreator = (statusCode, message, properties) => {
    // console.log("customeError statusCode", statusCode);
    // console.log("customeError message", message);
    // console.log("customeError properties", properties);
    return createError(statusCode, message, properties)
}

module.exports = errorCreator;
