const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        status: "fail",
        message: "Query validation failed",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
        requestId: req.requestId,
      });
    }

    if (value && typeof req.query === "object") {
      Object.keys(req.query).forEach((key) => {
        if (!(key in value)) {
          delete req.query[key];
        }
      });
      Object.assign(req.query, value);
    }

    next();
  };
};

export default validateQuery;
