const express = require("express");
const morgan = require("morgan");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");
const cookieParser = require("cookie-parser");
// const notificationRouter = require("./controllers/notificationController");
const { HTTP_STATUS } = require("./utils/constants");
const { connectDB } = require("./utils/functions");
const { initializeSocket } = require("./utils/socketHandler");

const app = express();

connectDB(process.env.MONGO_URI).then(() =>
  console.log("Connected to MongoDB 200 OK".bgGreen.bold)
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// app.use("/notifications", notificationRouter);

const PORT = process.env.NOTIFICATION_SERVICE_PORT;

const server = http.createServer(app);

initializeSocket(server);

app.use((err, req, res, next) => {
  const status = err.status || HTTP_STATUS.SERVER_ERROR;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

server.listen(PORT, () => {
  console.log(`notification service running on port ${PORT}`);
});

module.exports = app;
