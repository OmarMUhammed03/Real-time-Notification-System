const userRepository = require("../repositories/userRepository");
const { HTTP_STATUS } = require("../utils/constants");

exports.findAllUsers = async () => {
  const users = await userRepository.findAllUsers();
  return users;
};

exports.createUser = async (user) => {
  const createdUser = await userRepository.createUser(user);
  return createdUser;
};

exports.findUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return user;
};

exports.findUserByEmail = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    const error = new Error("User not found");
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return user;
};

exports.updateUser = async (id, user) => {
  const existingUser = await userRepository.findUserById(id);
  if (!existingUser) {
    const error = new Error("User not found");
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  const updatedUser = await userRepository.updateUser(id, user);
  return updatedUser;
};

exports.deleteUser = async (id) => {
  const existingUser = await userRepository.findUserById(id);
  if (!existingUser) {
    const error = new Error("User not found");
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  const deletedUser = await userRepository.deleteUser(id);
  return deletedUser;
};

