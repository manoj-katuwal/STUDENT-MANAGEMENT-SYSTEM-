import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import apiRoutes from "./routes/index.js";

const app = express();

// middleware
app.use(helmet()); // for security to secure http header method from hackers
app.use(cors()); // For connection between the backend and frontend
app.use(express.json()); // for the data sent from the UI and extract it using req.body;

//routes
app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
