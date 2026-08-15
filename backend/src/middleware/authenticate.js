
import { verifyAccessToken } from "../config/jwt.js";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authentication required");

    error.statusCode = 401;

    throw error;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    const authError = new Error("Invalid or expired access token");

    authError.statusCode = 401;

    throw authError;
  }
};

export default authenticate;
