import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDatabase from "./config/database.js";
import logger from "./config/logger.js";
import { verifyEmailConnection } from "./shared/services/email/email.service.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    await verifyEmailConnection();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed", {
      error: error.message,
    });
    process.exit(1);
  }
};

startServer();
