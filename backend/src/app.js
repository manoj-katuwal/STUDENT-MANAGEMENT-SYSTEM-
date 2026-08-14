import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import apiRoutes from "./routes/index.js";
import requestId from "./middleware/requestId.js";
import requestLogger from "./middleware/requestLogger.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

// middleware
app.use(helmet()); // for security to secure http header method from hackers
app.use(cors()); // For connection between the backend and frontend
app.use(express.json()); // for the data sent from the UI and extract it using req.body;

app.use(requestId);
app.use(requestLogger)

//routes
app.use("/api/v1", apiRoutes);
app.use("/api/v1/auth", authRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
