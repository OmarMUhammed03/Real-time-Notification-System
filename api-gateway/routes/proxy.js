const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { authenticate } = require("../middlewares/authMiddleWare");

const router = express.Router();

const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT;
const AUTH_SERVICE_URL = `http://localhost:${AUTH_SERVICE_PORT}/auth`;

const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;
const USER_SERVICE_URL = `http://localhost:${USER_SERVICE_PORT}/users`;

const NOTIFICATION_SERVICE_PORT = process.env.NOTIFICATION_SERVICE_PORT;
const NOTIFICATION_SERVICE_URL = `http://localhost:${NOTIFICATION_SERVICE_PORT}/notifications`;

router.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

router.use(
  "/users",
  authenticate,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
  })
);

router.use(
  "/notifications",
  authenticate,
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
  })
);

module.exports = router;
