const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authRepository = require("../repositories/authRepository");
const { HTTP_STATUS, BCRYPT_SALT_ROUNDS } = require("../utils/constants");
const JWT_SECRET = process.env.JWT_SECRET;
const { sendEvent } = require("../utils/kafkaProducer");

const register = async ({ email, password, ...body }) => {
  if(!body.name || !body.birthDate || !body.gender) {
    const error = new Error("Missing required fields");
    error.status = HTTP_STATUS.BAD_REQUEST;
    throw error;
  }
  const existing = await authRepository.findByEmail(email);
  if (existing) {
    const error = new Error("User already exists");
    error.status = HTTP_STATUS.CONFLICT;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = await authRepository.createUser({ email, hashedPassword });

  await sendEvent("userRegistered", [
    { value: JSON.stringify({ email: user.email, userId: user._id, ...body }) },
  ]);

  return user;
};

const login = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);
  const isMatch = user && (await user.comparePassword(password));
  if (!user || !isMatch) {
    const error = new Error("Invalid credentials");
    error.status = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }
  const token = jwt.sign({ id: user._id, roles: user.roles }, JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_DURATION,
  });
  const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_DURATION,
  });
  await authRepository.addRefreshToken(user._id, refreshToken);
  return { token, refreshToken };
};

const refreshToken = async (token) => {
  if (!token) {
    const error = new Error("No refresh token provided");
    error.status = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }
  const user = await authRepository.findUserByRefreshToken(token);
  if (!user) {
    const error = new Error("Invalid refresh token");
    error.status = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }
  jwt.verify(token, JWT_SECRET);
  const newToken = jwt.sign({ id: user._id, roles: user.roles }, JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_DURATION,
  });
  return { token: newToken };
};

const logout = async (token) => {
  if (!token) return { message: "No token provided" };
  const user = await authRepository.findUserByRefreshToken(token);
  if (user) {
    await authRepository.removeRefreshToken(user._id, token);
  }
  return { message: "Logged out successfully" };
};

module.exports = { register, login, refreshToken, logout };
