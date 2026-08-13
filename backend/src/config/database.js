import mongoose from "mongoose";
import logger from "./logger.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // console.log(" MongoDB connected successfully");
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connected sucessfully", {
      error: error.message,
    });

    process.exit(1);
  }
};

export default connectDatabase;
