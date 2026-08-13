export const successResponse = ({
  res,
  statusCode = 200,
  message = "Request successful",
  data = null,
  meta = null,
}) => {
  return res.status(statusCode).json({
    success: true,
    status: "success",
    message,
    data,
    ...(meta && { meta }),
  });
};
