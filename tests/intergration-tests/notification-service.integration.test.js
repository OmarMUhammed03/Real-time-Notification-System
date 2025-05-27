jest.setTimeout(15000);
const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const notificationRouter = require("../../notification-service/controllers/notificationController");
const Notification = require("../../notification-service/models/Notification");
const { HTTP_STATUS } = require("../../notification-service/utils/constants");

const mongoUri = process.env.TEST_MONGO_URI || "mongodb://localhost:27017/notification_service_test";

let app;

describe("Notification Service Integration", () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    app = express();
    app.use(express.json());
    app.use("/", notificationRouter);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Notification.deleteMany({});
  });

  describe("GET /senderId/:senderId", () => {
    it("should return notifications sent by senderId", async () => {
      await Notification.create({
        title: "Test",
        content: "Hello",
        senderId: "user1",
        receiverId: "user2",
        category: "inbox"
      });
      await Notification.create({
        title: "Test2",
        content: "Hi",
        senderId: "user1",
        receiverId: "user3",
        category: "spam"
      });
      await Notification.create({
        title: "Other",
        content: "No",
        senderId: "userX",
        receiverId: "user2",
        category: "inbox"
      });
      const res = await request(app).get("/senderId/user1");
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].senderId).toBe("user1");
    });
  });

  describe("GET /receiverId/:receiverId", () => {
    it("should return notifications received by receiverId", async () => {
      await Notification.create({
        title: "Test",
        content: "Hello",
        senderId: "user1",
        receiverId: "user2",
        category: "inbox"
      });
      await Notification.create({
        title: "Test2",
        content: "Hi",
        senderId: "user3",
        receiverId: "user2",
        category: "spam"
      });
      await Notification.create({
        title: "Other",
        content: "No",
        senderId: "userX",
        receiverId: "userX",
        category: "inbox"
      });
      const res = await request(app).get("/receiverId/user2");
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].receiverId).toBe("user2");
    });
  });

  describe("PUT /:id", () => {
    it("should update a notification", async () => {
      const notif = await Notification.create({
        title: "Test",
        content: "Hello",
        senderId: "user1",
        receiverId: "user2",
        category: "inbox"
      });
      const res = await request(app)
        .put(`/${notif._id}`)
        .send({ isRead: true });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.isRead).toBe(true);
    });
  });

  describe("DELETE /:id", () => {
    it("should delete a notification", async () => {
      const notif = await Notification.create({
        title: "Test",
        content: "Hello",
        senderId: "user1",
        receiverId: "user2",
        category: "inbox"
      });
      const res = await request(app).delete(`/${notif._id}`);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body._id).toBe(notif._id.toString());
      const found = await Notification.findById(notif._id);
      expect(found).toBeNull();
    });
  });
});
