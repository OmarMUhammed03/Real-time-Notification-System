const jwt = require("jsonwebtoken");
const { HTTP_STATUS } = require("../../utils/constants");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: "Invalid token" });
  }
};

module.exports = { authenticate };
