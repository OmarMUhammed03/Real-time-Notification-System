const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");

const app = express();
const authRouter = require("./controllers/authController");
const { HTTP_STATUS } = require("./utils/constants");
const { connectDB } = require("./utils/functions");

connectDB(process.env.MONGO_URI).then(() =>
  console.log("Connected to MongoDB 200 OK".bgGreen.bold)
);

app.use(express.json());
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  const status = err.status || HTTP_STATUS.SERVER_ERROR;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.AUTH_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

module.exports = app;
