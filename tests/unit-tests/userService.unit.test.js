require("supertest");
const userRepository = require("../../user-service/repositories/userRepository");
const userService = require("../../user-service/services/userService");

jest.mock("../../user-service/repositories/userRepository");

describe("userService", () => {
  beforeEach(() => jest.clearAllMocks());

  test("findAllUsers should return all users", async () => {
    const mockUsers = [{ _id: "1", email: "test@example.com" }];
    userRepository.findAllUsers.mockResolvedValue(mockUsers);
    const result = await userService.findAllUsers();
    expect(userRepository.findAllUsers).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
  });

  test("findById should return user if found", async () => {
    const mockUser = { _id: "1", email: "test@example.com" };
    userRepository.findUserById.mockResolvedValue(mockUser);
    const result = await userService.findUserById("1");
    expect(userRepository.findUserById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockUser);
  });

  test("findById should throw error if not found", async () => {
    userRepository.findUserById.mockResolvedValue(null);
    expect(userService.findUserById("notfound")).rejects.toThrow(
      "User not found"
    );
    expect(userRepository.findUserById).toHaveBeenCalledWith("notfound");
  });

  test("createUser should create and return user", async () => {
    const mockUser = { _id: "1", email: "test@example.com" };
    userRepository.createUser.mockResolvedValue(mockUser);
    const result = await userService.createUser({
      email: "test@example.com",
      name: "Test",
      birthDate: "2000-01-01",
      gender: "male",
    });
    expect(userRepository.createUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
  });

  test("findUserByEmail should return user if found", async () => {
    const mockUser = { _id: "1", email: "test@example.com" };
    userRepository.findUserByEmail.mockResolvedValue(mockUser);
    const result = await userService.findUserByEmail("test@example.com");
    expect(userRepository.findUserByEmail).toHaveBeenCalledWith("test@example.com");
    expect(result).toEqual(mockUser);
  });

  test("findUserByEmail should throw error if not found", async () => {
    userRepository.findUserByEmail.mockResolvedValue(null);
    await expect(userService.findUserByEmail("notfound@example.com")).rejects.toThrow("User not found");
    expect(userRepository.findUserByEmail).toHaveBeenCalledWith("notfound@example.com");
  });

  test("updateUser should update and return user", async () => {
    const mockUser = { _id: "1", email: "updated@example.com" };
    userRepository.findUserById.mockResolvedValue(mockUser);
    userRepository.updateUser.mockResolvedValue(mockUser);
    const result = await userService.updateUser("1", { email: "updated@example.com" });
    expect(userRepository.findUserById).toHaveBeenCalledWith("1");
    expect(userRepository.updateUser).toHaveBeenCalledWith("1", { email: "updated@example.com" });
    expect(result).toEqual(mockUser);
  });

  test("updateUser should throw error if user not found", async () => {
    userRepository.findUserById.mockResolvedValue(null);
    await expect(userService.updateUser("notfound", { email: "x" })).rejects.toThrow("User not found");
    expect(userRepository.findUserById).toHaveBeenCalledWith("notfound");
  });

  test("deleteUser should delete and return user", async () => {
    const mockUser = { _id: "1", email: "deleted@example.com" };
    userRepository.findUserById.mockResolvedValue(mockUser);
    userRepository.deleteUser.mockResolvedValue(mockUser);
    const result = await userService.deleteUser("1");
    expect(userRepository.findUserById).toHaveBeenCalledWith("1");
    expect(userRepository.deleteUser).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockUser);
  });

  test("deleteUser should throw error if user not found", async () => {
    userRepository.findUserById.mockResolvedValue(null);
    await expect(userService.deleteUser("notfound")).rejects.toThrow("User not found");
    expect(userRepository.findUserById).toHaveBeenCalledWith("notfound");
  });
});
