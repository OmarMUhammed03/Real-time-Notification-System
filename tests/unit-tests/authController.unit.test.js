const express = require("express");
const request = require("supertest");
const cookieParser = require('cookie-parser');

const authRouter = require("../../auth-service/controllers/authController");
jest.mock("../../auth-service/services/authService");
const authService = require("../../auth-service/services/authService");

const { HTTP_STATUS } = require("../../auth-service/utils/constants");

describe("AuthController routes", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use("/auth", authRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /auth/register - should register a user", async () => {
    const mockUser = { _id: "1", email: "test@example.com" };
    authService.register.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "test@example.com",
        password: "pass",
        name: "Test",
        birthDate: "2000-01-01",
        gender: "male",
      });

    expect(res.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(res.body.userId).toBe(mockUser._id);
    expect(authService.register).toHaveBeenCalledTimes(1);
  });

  test("POST /auth/login - should login a user and set cookies", async () => {
    authService.login.mockResolvedValue({
      token: "token",
      refreshToken: "refresh",
    });
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "pass" });
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(authService.login).toHaveBeenCalledTimes(1);
  });

  test("POST /auth/register - should handle error", async () => {
    authService.register.mockRejectedValue(new Error("fail"));
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "fail@example.com",
        password: "pass",
        name: "Test",
        birthDate: "2000-01-01",
        gender: "male",
      });
    expect(res.statusCode).toBe(HTTP_STATUS.SERVER_ERROR);
    expect(authService.register).toHaveBeenCalledTimes(1);
  });

  test("GET /auth/me - should return user details and set headers", async () => {
    const mockUser = { id: "1", email: "test@example.com" };
    authService.getCurrentUser.mockResolvedValue(mockUser);

    const res = await request(app)
      .get("/auth/me")
      .set("Cookie", ["access_token=token"]);

    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body).toEqual(mockUser);
    expect(res.headers["x-user-id"]).toBe(mockUser.id);
    expect(res.headers["x-user-email"]).toBe(mockUser.email);
    expect(authService.getCurrentUser).toHaveBeenCalledWith("token");
  });

  test("POST /auth/refresh-token - should refresh token and set cookie", async () => {
    authService.refreshToken.mockResolvedValue({ token: "newtoken" });
    const res = await request(app)
      .post("/auth/refresh-token")
      .send({ refreshToken: "refresh" });
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(authService.refreshToken).toHaveBeenCalledWith("refresh");
    expect(res.body).toEqual({ token: "newtoken" });
  });

  test("POST /auth/logout - should logout and clear cookies", async () => {
    authService.logout.mockResolvedValue({ message: "Logged out" });
    const res = await request(app)
      .post("/auth/logout")
      .set("Cookie", ["refresh_token=refresh"]);
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(authService.logout).toHaveBeenCalledWith("refresh");
    expect(res.body).toEqual({ message: "Logged out" });
  });
});
