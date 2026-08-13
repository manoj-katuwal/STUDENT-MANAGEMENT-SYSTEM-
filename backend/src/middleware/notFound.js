const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    status: "fail",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export default notFound;
