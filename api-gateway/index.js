const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const proxy = require("./routes/proxy");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const colors = require("colors");
const http = require("http");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gateway",
      version: "1.0.0",
      description: "API documentation for the Gateway (proxy endpoints)",
    },
    servers: [
      { url: `http://localhost:${process.env.API_GATEWAY_PORT || 3000}` },
    ],
  },
  apis: [
    "./docs/gateway.swagger.js",
  ],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors({
  origin: "http://localhost:8000",
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));

app.use("/api", proxy);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`.cyan.bold);
});
