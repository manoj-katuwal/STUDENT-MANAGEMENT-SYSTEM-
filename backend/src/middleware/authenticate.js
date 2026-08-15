import { verifyAccessToken } from "../config/jwt.js";
import { findUserById } from "../modules/users/user.repository.js";
import AppError from "../shared/utils/error/AppError.js";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    const user = await findUserById(decoded.sub);

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Your account is inactive", 403));
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Invalid or expired access token", 401));
  }
};

export default authenticate;
