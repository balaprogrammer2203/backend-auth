const { StatusCodes } = require('http-status-codes');
const config = require('../config/config');
const wLogger = require('../helpers/logger/winstonLogger');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("Middleware Error Handling called")
  // console.error("err", err);

  // console.error("err.errors", err.errors);
  // console.error("err.statusCode", err.statusCode);
  // console.error("err.message", err.message);

  // console.error("err.stack", err.stack);

  // console.error("err.value", err.value);
  // console.error("err.name", err.name);
  // console.error("err.code", err.code);
  // console.error("err.keyValue", err.keyValue);

  let customErrorResponse = {
    // set default
    success: false,
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Internal Sever Error or Something went wrong',
    data: err.errors || null
  }

  //for morgan message
  res.locals.errorMessage = err.message;

  if (config.env === 'development') {
    wLogger.error(err);
  }

  // if (res.headerSent) {
  //     //res already sent ? => don't send res, just forward the error
  //     return next(err);
  // }

  if (err.code && err.code === 11000) {
    customErrorResponse.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    customErrorResponse.statusCode = 400
  }
  if (err.name === 'CastError') {
    customErrorResponse.message = `No item found with id : ${err.value}`
    customErrorResponse.statusCode = 404
  }

  // let errorResponse = {
  //   success: false,
  //   message: err.message || 'Something went wrong',
  //   data: err.errors || null
  // };

  console.log("customErrorResponse: ", customErrorResponse);
  return res.status(customErrorResponse.statusCode).json(customErrorResponse);
};

module.exports = errorHandlerMiddleware;
