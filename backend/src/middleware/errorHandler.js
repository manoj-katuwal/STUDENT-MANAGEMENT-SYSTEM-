import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  // Log full error details — message + stack so terminal shows the real cause
  logger.error(`${err.message || "Unhandled request error"}`, {
    stack: err.stack,
    method: req.method,
    path: req.originalUrl,
    requestId: req.requestId,
    statusCode: err.statusCode || 500,
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  const status = err.status || (statusCode < 500 ? "fail" : "error");

  // In development: show real error message for 500s so you can debug
  // In production: hide internal details from client
  const clientMessage =
    statusCode >= 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : message;

  return res.status(statusCode).json({
    success: false,
    status,
    message: clientMessage,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    requestId: req.requestId,
  });
};

export default errorHandler;
