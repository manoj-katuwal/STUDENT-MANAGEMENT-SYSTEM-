import jwt from "jsonwebtoken";

import AppError from "../shared/utils/error/AppError.js";

const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Authentication token is required", 401));
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError("Invalid or expired authentication token", 401));
  }
};

export default authenticate;
