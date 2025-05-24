const express = require("express");
const proxy = require("./routes/proxy");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const colors = require("colors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));

app.use("/api", proxy);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`.cyan.bold);
});
