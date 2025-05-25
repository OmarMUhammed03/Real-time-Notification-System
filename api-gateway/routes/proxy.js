const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

// TODO: add authentication middleware

const router = express.Router();

const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT;
const AUTH_SERVICE_URL = `http://localhost:${AUTH_SERVICE_PORT}/auth`;

const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;
const USER_SERVICE_URL = `http://localhost:${USER_SERVICE_PORT}/users`;

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API Gateway",
  });
});

router.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

router.use(
  "/users",
  createProxyMiddleware({
    target: USER_SERVICE_URL,
  })
);

module.exports = router;
