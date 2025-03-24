function sendResponse(res, statusCode, success, message, data) {
  const response = {
    success: success,
    message: message,
    data: data
  };
  //console.log("response", response)
  res.status(statusCode).json(response);
}

module.exports = sendResponse;
