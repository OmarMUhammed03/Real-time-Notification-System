const express = require("express");
const dotenv = require("dotenv");
require('./events/userEventsConsumer');

const app = express();
const userRouter = require("./controllers/userController");
const { HTTP_STATUS } = require("../utils/constants");

app.use(express.json());
app.use("/users", userRouter);

app.use((err, req, res, next) => {
  const status = err.status || HTTP_STATUS.SERVER_ERROR;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.USER_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

module.exports = app;
