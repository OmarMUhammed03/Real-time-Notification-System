const axios = require("axios");
const { HTTP_STATUS } = require("../../auth-service/utils/constants");

async function authenticate(req, res, next) {
  try {
    const AUTH_SERVICE_URL = `http://localhost:${process.env.AUTH_SERVICE_PORT}/auth`;
    const cookieHeader = Object.entries(req.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");
    console.log("incoming request", req.originalUrl, cookieHeader);
    const response = await axios.get(`${AUTH_SERVICE_URL}/me`, {
      headers: { cookie: cookieHeader },
      validateStatus: () => true,
    });
    console.log("response", response);
    if (response.status === 200 && response.data) {
      if (response.headers["X-User-Id"]) {
        req.headers["X-User-Id"] = response.headers["X-User-Id"];
      }
      if (response.headers["X-User-Email"]) {
        req.headers["X-User-Email"] = response.headers["X-User-Email"];
      }
      next();
    } else {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: response.data.error || "Unauthorized" });
    }
  } catch (err) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: err.message || "Unauthorized" });
  }
}

module.exports = { authenticate };
