import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled request error", {
    err,
    method: req.method,
    path: req.originalUrl,
    requestId: req.requestId,
  });

  let statusCode = err.statusCode || 500;
  let message = err.message;

 
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  const status = err.status || (statusCode < 500 ? "fail" : "error");

  return res.status(statusCode).json({
    success: false,
    status,
    message: statusCode === 500 ? "Internal Server Error" : message,
    requestId: req.requestId,
  });
};

export default errorHandler;
