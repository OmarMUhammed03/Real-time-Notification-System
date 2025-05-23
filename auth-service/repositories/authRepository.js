const AuthUser = require("../models/authUser");

const findByEmail = async (email) => AuthUser.findOne({ email });
const createUser = async (data) => new AuthUser(data).save();
const addRefreshToken = async (userId, token) => {
  return AuthUser.findByIdAndUpdate(
    userId,
    { $addToSet: { refreshTokens: token } },
    { new: true }
  );
};

const removeRefreshToken = async (userId, token) => {
  return AuthUser.findByIdAndUpdate(
    userId,
    { $pull: { refreshTokens: token } },
    { new: true }
  );
};

const findUserByRefreshToken = async (token) => {
  return AuthUser.findOne({ refreshTokens: { $in: [token] } });
};

module.exports = {
  findByEmail,
  createUser,
  addRefreshToken,
  removeRefreshToken,
  findUserByRefreshToken,
};
