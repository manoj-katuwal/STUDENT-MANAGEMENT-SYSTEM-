import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/database.js";
import logger from "./config/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

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
