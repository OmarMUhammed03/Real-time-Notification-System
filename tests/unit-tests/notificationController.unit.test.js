const express = require("express");
const request = require("supertest");

const notificationRouter = require("../../notification-service/controllers/notificationController");
jest.mock("../../notification-service/services/notificationService");
const notificationService = require("../../notification-service/services/notificationService");

const { HTTP_STATUS } = require("../../notification-service/utils/constants");

describe("NotificationController routes", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/notifications", notificationRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /notifications/senderId/:senderId - should return notifications by senderId", async () => {
    const mockNotifications = [{ _id: "1", senderId: "user1" }];
    notificationService.findNotificationsBySenderId.mockResolvedValue(mockNotifications);
    const res = await request(app).get("/notifications/senderId/user1");
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body).toEqual(mockNotifications);
    expect(notificationService.findNotificationsBySenderId).toHaveBeenCalledWith("user1");
  });

  test("GET /notifications/receiverId/:receiverId - should return notifications by receiverId", async () => {
    const mockNotifications = [{ _id: "1", receiverId: "user2" }];
    notificationService.findNotificationsByReceiverId.mockResolvedValue(mockNotifications);
    const res = await request(app).get("/notifications/receiverId/user2");
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body).toEqual(mockNotifications);
    expect(notificationService.findNotificationsByReceiverId).toHaveBeenCalledWith("user2");
  });

  test("PUT /notifications/:id - should update a notification", async () => {
    const mockNotification = { _id: "1", message: "updated" };
    notificationService.updateNotification.mockResolvedValue(mockNotification);
    const res = await request(app)
      .put("/notifications/1")
      .send({ message: "updated" });
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body).toEqual(mockNotification);
    expect(notificationService.updateNotification).toHaveBeenCalledWith("1", { message: "updated" });
  });

  test("DELETE /notifications/:id - should delete a notification", async () => {
    const mockNotification = { _id: "1", message: "deleted" };
    notificationService.deleteNotification.mockResolvedValue(mockNotification);
    const res = await request(app).delete("/notifications/1");
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.body).toEqual(mockNotification);
    expect(notificationService.deleteNotification).toHaveBeenCalledWith("1");
  });

  test("GET /notifications/senderId/:senderId - should handle service error", async () => {
    notificationService.findNotificationsBySenderId.mockRejectedValue(new Error("Service error"));
    const res = await request(app).get("/notifications/senderId/user1");
    expect(res.statusCode).toBe(HTTP_STATUS.SERVER_ERROR);
  });

  test("GET /notifications/receiverId/:receiverId - should handle service error", async () => {
    notificationService.findNotificationsByReceiverId.mockRejectedValue(new Error("Service error"));
    const res = await request(app).get("/notifications/receiverId/user2");
    expect(res.statusCode).toBe(HTTP_STATUS.SERVER_ERROR);
  });

  test("PUT /notifications/:id - should handle service error", async () => {
    notificationService.updateNotification.mockRejectedValue(new Error("Service error"));
    const res = await request(app)
      .put("/notifications/1")
      .send({ message: "updated" });
    expect(res.statusCode).toBe(HTTP_STATUS.SERVER_ERROR);
  });

  test("DELETE /notifications/:id - should handle service error", async () => {
    notificationService.deleteNotification.mockRejectedValue(new Error("Service error"));
    const res = await request(app).delete("/notifications/1");
    expect(res.statusCode).toBe(HTTP_STATUS.SERVER_ERROR);
  });
});
