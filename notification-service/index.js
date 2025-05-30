const express = require("express");
const morgan = require("morgan");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");
const cookieParser = require("cookie-parser");
const notificationRouter = require("./controllers/notificationController");
const { HTTP_STATUS } = require("./utils/constants");
const { connectDB } = require("./utils/functions");
const { initializeSocket } = require("./utils/socketHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const server = http.createServer(app);

connectDB(process.env.MONGO_URI).then(() =>
  console.log("Connected to MongoDB 200 OK".bgGreen.bold)
);

app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/notifications", notificationRouter);

initializeSocket(server);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notification Service API",
      version: "1.0.0",
      description: "API documentation for the Notification Service",
    },
    servers: [
      { url: `http://localhost:${process.env.NOTIFICATION_SERVICE_PORT}` },
    ],
  },
  apis: [
    "./docs/notification.swagger.js",
  ],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  const status = err.status || HTTP_STATUS.SERVER_ERROR;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.NOTIFICATION_SERVICE_PORT;

server.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});

module.exports = app;
