const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  const status = err.status || "error";

  return res.status(statusCode).json({
    success: false,
    status,
    message: statusCode === 500 ? "Internal Server Error" : err.message,
    requestId: req.requestId,
  });
};

export default errorHandler;
