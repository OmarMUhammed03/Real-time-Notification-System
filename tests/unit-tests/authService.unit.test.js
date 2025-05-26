const authRepository = require("../../auth-service/repositories/authRepository");
const authService = require("../../auth-service/services/authService");

jest.mock("../../auth-service/repositories/authRepository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const fakeUser = { _id: "1", email: "test@example.com", comparePassword: jest.fn() };

describe("authService", () => {
  beforeEach(() => jest.clearAllMocks());

  test("register should throw if required fields missing", async () => {
    await expect(authService.register({ email: "a" })).rejects.toThrow("Missing required fields");
  });

  test("login should throw if user not found", async () => {
    authRepository.findByEmail.mockResolvedValue(null);
    await expect(authService.login({ email: "a", password: "p" })).rejects.toThrow("Invalid credentials");
  });

  test("login should throw if password does not match", async () => {
    fakeUser.comparePassword.mockResolvedValue(false);
    authRepository.findByEmail.mockResolvedValue(fakeUser);
    await expect(authService.login({ email: "a", password: "p" })).rejects.toThrow("Invalid credentials");
  });

  test("getCurrentUser should throw if no token", async () => {
    await expect(authService.getCurrentUser(null)).rejects.toThrow("No token provided");
  });

  test("refreshToken should throw if no token", async () => {
    await expect(authService.refreshToken(null)).rejects.toThrow("No refresh token provided");
  });

  test("refreshToken should throw if user not found", async () => {
    authRepository.findUserByRefreshToken.mockResolvedValue(null);
    await expect(authService.refreshToken("badtoken")).rejects.toThrow("Invalid refresh token");
  });

  test("logout should return message if no token", async () => {
    const result = await authService.logout(null);
    expect(result).toEqual({ message: "No token provided" });
  });

  test("logout should remove token if user found", async () => {
    authRepository.findUserByRefreshToken.mockResolvedValue(fakeUser);
    authRepository.removeRefreshToken.mockResolvedValue();
    const result = await authService.logout("tok");
    expect(authRepository.removeRefreshToken).toHaveBeenCalledWith(fakeUser._id, "tok");
    expect(result).toEqual({ message: "Logged out successfully" });
  });

  test("logout should return message if user not found", async () => {
    authRepository.findUserByRefreshToken.mockResolvedValue(null);
    const result = await authService.logout("tok");
    expect(result).toEqual({ message: "Logged out successfully" });
  });

});
