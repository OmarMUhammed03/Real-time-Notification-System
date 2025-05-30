const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");
require("./events/userEventsConsumer");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const userRouter = require("./controllers/userController");
const { HTTP_STATUS } = require("./utils/constants");
const { connectDB } = require("./utils/functions");

connectDB(process.env.MONGO_URI).then(() =>
  console.log("Connected to MongoDB 200 OK".bgGreen.bold)
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/users", userRouter);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "API documentation for the User Service",
    },
    servers: [
      { url: `http://localhost:${process.env.USER_SERVICE_PORT}` },
    ],
  },
  apis: [
    "./docs/user.swagger.js",
  ],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  const status = err.status || HTTP_STATUS.SERVER_ERROR;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.USER_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});

module.exports = app;
