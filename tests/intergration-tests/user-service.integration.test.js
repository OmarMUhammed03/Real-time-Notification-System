jest.setTimeout(10000);
const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const userRouter = require("../../user-service/controllers/userController");
const User = require("../../user-service/models/User");
const { HTTP_STATUS } = require("../../user-service/utils/constants");

// Use a local/test MongoDB URI for integration tests
const mongoUri =
  process.env.TEST_MONGO_URI || "mongodb://localhost:27017/user_service_test";

let app;

describe("User Service Integration", () => {
  beforeAll(async () => {
    console.log("Attempting to connect to", mongoUri);
    await mongoose.connect(mongoUri);
    
    app = express();
    app.use(express.json());
    app.use("/", userRouter);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all users", async () => {
      await User.create({
        email: "a@b.com",
        name: "Alice",
        birthDate: "2000-01-01",
        gender: "female",
      });
      await User.create({
        email: "b@b.com",
        name: "Bob",
        birthDate: "1990-01-01",
        gender: "male",
      });
      const res = await request(app).get("/");
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.data.length).toBe(2);
    });
  });

  // describe("POST /", () => {
  //   it("should create a user", async () => {
  //     const user = {
  //       email: "a@b.com",
  //       name: "Alice",
  //       birthDate: "2000-01-01",
  //       gender: "female",
  //     };
  //     const res = await request(app).post("/").send(user);
  //     expect(res.status).toBe(HTTP_STATUS.CREATED);
  //     expect(res.body.data.email).toBe(user.email);
  //   });
  // });

  // describe("GET /:id", () => {
  //   it("should return a user by id", async () => {
  //     const user = await User.create({
  //       email: "a@b.com",
  //       name: "Alice",
  //       birthDate: "2000-01-01",
  //       gender: "female",
  //     });
  //     const res = await request(app).get(`/${user._id}`);
  //     expect(res.status).toBe(HTTP_STATUS.OK);
  //     expect(res.body.data.email).toBe(user.email);
  //   });

  //   it("should return 404 if user not found", async () => {
  //     const id = new mongoose.Types.ObjectId();
  //     const res = await request(app).get(`/${id}`);
  //     expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
  //   });
  // });

  // describe("PUT /:id", () => {
  //   it("should update a user", async () => {
  //     const user = await User.create({
  //       email: "a@b.com",
  //       name: "Alice",
  //       birthDate: "2000-01-01",
  //       gender: "female",
  //     });
  //     const res = await request(app)
  //       .put(`/${user._id}`)
  //       .send({ name: "Alicia" });
  //     expect(res.status).toBe(HTTP_STATUS.OK);
  //     expect(res.body.data.name).toBe("Alicia");
  //   });

  //   it("should return 404 if user not found", async () => {
  //     const id = new mongoose.Types.ObjectId();
  //     const res = await request(app).put(`/${id}`).send({ name: "Alicia" });
  //     expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
  //   });
  // });

  // describe("DELETE /:id", () => {
  //   it("should delete a user", async () => {
  //     const user = await User.create({
  //       email: "a@b.com",
  //       name: "Alice",
  //       birthDate: "2000-01-01",
  //       gender: "female",
  //     });
  //     const res = await request(app).delete(`/${user._id}`);
  //     expect(res.status).toBe(HTTP_STATUS.OK);
  //     expect(res.body.data.email).toBe(user.email);
  //   });

  //   it("should return 404 if user not found", async () => {
  //     const id = new mongoose.Types.ObjectId();
  //     const res = await request(app).delete(`/${id}`);
  //     expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
  //   });
  // });

  // describe("GET /email/:email", () => {
  //   it("should return a user by email", async () => {
  //     const user = await User.create({
  //       email: "a@b.com",
  //       name: "Alice",
  //       birthDate: "2000-01-01",
  //       gender: "female",
  //     });
  //     const res = await request(app).get(`/email/${user.email}`);
  //     expect(res.status).toBe(HTTP_STATUS.OK);
  //     expect(res.body.data.email).toBe(user.email);
  //   });

  //   it("should return 404 if user not found", async () => {
  //     const res = await request(app).get("/email/notfound@email.com");
  //     expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
  //   });
  // });
});
