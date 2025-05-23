const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  findByEmail,
  createUser,
  addRefreshToken,
  removeRefreshToken,
  findUserByRefreshToken,
} = require("../repositories/authRepository");
const { HTTP_STATUS, BCRYPT_SALT_ROUNDS } = require("../../utils/constants");
const JWT_SECRET = process.env.JWT_SECRET;

const register = async ({ email, password }) => {
  const existing = await findByEmail(email);
  if (existing) {
    const error = new Error("User already exists");
    error.status = HTTP_STATUS.CONFLICT;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  return createUser({ email, hashedPassword });
};

const login = async ({ email, password }) => {
  const user = await findByEmail(email);
  const isMatch = user && (await user.comparePassword(password));
  if (!user || !isMatch) {
    const error = new Error("Invalid credentials");
    error.status = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }
  const token = jwt.sign({ id: user._id, roles: user.roles }, JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });
  await addRefreshToken(user._id, refreshToken);
  return { token, refreshToken };
};

const refreshToken = async (token) => {
  if (!token) {
    const error = new Error("No refresh token provided");
    error.status = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }
  const user = await findUserByRefreshToken(token);
  if (!user) {
    const error = new Error("Invalid refresh token");
    error.status = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }
  jwt.verify(token, JWT_SECRET);
  const newToken = jwt.sign({ id: user._id, roles: user.roles }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return { token: newToken };
};

const logout = async (token) => {
  if (!token) return { message: "No token provided" };
  const user = await findUserByRefreshToken(token);
  if (user) {
    await removeRefreshToken(user._id, token);
  }
  return { message: "Logged out successfully" };
};

module.exports = { register, login, refreshToken, logout };
