const express = require("express");
const request = require("supertest");

const userRouter = require("../../user-service/controllers/userController");
jest.mock("../../user-service/services/userService");
const userService = require("../../user-service/services/userService");

const { HTTP_STATUS } = require("../../user-service/utils/constants");

describe("UserController routes", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/users", userRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /users - should return all users", async () => {
    const mockUsers = [{ _id: "1", email: "test@example.com" }];
    userService.findAllUsers.mockResolvedValue(mockUsers);

    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body.data).toEqual(mockUsers);
    expect(userService.findAllUsers).toHaveBeenCalledTimes(1);
  });

  test("POST /users - should create a user", async () => {
    const mockUser = { _id: "1", email: "test@example.com" };
    userService.createUser.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/users")
      .send({ email: "test@example.com", name: "Test", birthDate: "2000-01-01", gender: "male" });

    expect(res.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(res.body.data).toEqual(mockUser);
    expect(userService.createUser).toHaveBeenCalledTimes(1);
  });

  test("GET /users/:id - should return a user by id", async () => {
    const mockUser = { _id: "1", email: "test@example.com" };
    userService.findUserById.mockResolvedValue(mockUser);
    const res = await request(app).get("/users/1");
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body.data).toEqual(mockUser);
    expect(userService.findUserById).toHaveBeenCalledWith("1");
  });

  test("PUT /users/:id - should update a user", async () => {
    const mockUser = { _id: "1", email: "updated@example.com" };
    userService.updateUser.mockResolvedValue(mockUser);
    const res = await request(app)
      .put("/users/1")
      .send({ email: "updated@example.com" });
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body.data).toEqual(mockUser);
    expect(userService.updateUser).toHaveBeenCalledWith("1", { email: "updated@example.com" });
  });

  test("DELETE /users/:id - should delete a user", async () => {
    const mockUser = { _id: "1", email: "deleted@example.com" };
    userService.deleteUser.mockResolvedValue(mockUser);
    const res = await request(app).delete("/users/1");
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body.data).toEqual(mockUser);
    expect(userService.deleteUser).toHaveBeenCalledWith("1");
  });

  test("GET /users/email/:email - should return a user by email", async () => {
    const mockUser = { _id: "1", email: "test@example.com" };
    userService.findUserByEmail.mockResolvedValue(mockUser);
    const res = await request(app).get("/users/email/test@example.com");
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body.data).toEqual(mockUser);
    expect(userService.findUserByEmail).toHaveBeenCalledWith("test@example.com");
  });
});
