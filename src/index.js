require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { setupCronJobs } = require("./utils/cronJobs");
const { logger } = require("./utils/logger");
const routes = require("./routes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api", routes);

// Error handling middleware
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find route ${req.originalUrl} on this server`, 404));
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB 💥");
    logger.info("Connected to MongoDB");
    // Start cron jobs
    setupCronJobs();
  })
  .catch((error) => {
    console.log("error while connecting to db", error);
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

app.use(globalErrorHandler);

module.exports = app;
