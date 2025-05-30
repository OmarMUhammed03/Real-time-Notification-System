const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const authRouter = require("./controllers/authController");
const { HTTP_STATUS } = require("./utils/constants");
const { connectDB } = require("./utils/functions");

connectDB(process.env.MONGO_URI).then(() =>
  console.log("Connected to MongoDB 200 OK".bgGreen.bold)
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Service API",
      version: "1.0.0",
      description: "API documentation for the Auth Service",
    },
    servers: [
      { url: `http://localhost:${process.env.AUTH_SERVICE_PORT || 3001}` },
    ],
  },
  apis: ["./docs/auth.swagger.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  const status = err.status || HTTP_STATUS.SERVER_ERROR;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.AUTH_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

module.exports = app;
