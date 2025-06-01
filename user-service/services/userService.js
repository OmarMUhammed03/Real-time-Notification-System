const userRepository = require("../repositories/userRepository");
const { HTTP_STATUS } = require("../utils/constants");
const { sendEvent } = require("../utils/kafkaProducer");

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

exports.updateUserByEmail = async (email, userData) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (!existingUser) {
    const error = new Error("User not found");
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  const { password, ...userData } = user;
  const oldName = existingUser.name;
  const updatedUser = await userRepository.updateUser(
    existingUser._id,
    userData
  );
  if (userData.name !== oldName) {
    await sendEvent("userNameUpdated", [
      { value: JSON.stringify({ email, name: userData.name }) },
    ]);
  }
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
