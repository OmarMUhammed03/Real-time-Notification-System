require("supertest");
const notificationRepository = require("../../notification-service/repositories/notificationRepository");
const notificationService = require("../../notification-service/services/notificationService");

jest.mock("../../notification-service/repositories/notificationRepository");

describe("notificationService", () => {
  beforeEach(() => jest.clearAllMocks());

  test("createNotification should throw if required fields missing", async () => {
    await expect(notificationService.createNotification({})).rejects.toThrow(
      "Missing required fields"
    );
  });

  test("createNotification should call repository and return created notification", async () => {
    const mockNotif = {
      receiverId: "r",
      senderId: "s",
      content: "c",
      title: "t",
      category: "inbox",
    };
    notificationRepository.createNotification.mockResolvedValue(mockNotif);
    const result = await notificationService.createNotification(mockNotif);
    expect(notificationRepository.createNotification).toHaveBeenCalledWith(
      mockNotif
    );
    expect(result).toEqual(mockNotif);
  });

  test("findNotificationsBySenderId should call repository", async () => {
    notificationRepository.getSentNotifications.mockResolvedValue([{}]);
    const result = await notificationService.findNotificationsBySenderId("s");
    expect(notificationRepository.getSentNotifications).toHaveBeenCalledWith(
      "s"
    );
    expect(result).toEqual([{}]);
  });

  test("findNotificationsByReceiverId should call repository", async () => {
    notificationRepository.getNotifications.mockResolvedValue([{}]);
    const result = await notificationService.findNotificationsByReceiverId("r");
    expect(notificationRepository.getNotifications).toHaveBeenCalledWith("r");
    expect(result).toEqual([{}]);
  });

  test("updateNotification should call repository", async () => {
    notificationRepository.updateNotification.mockResolvedValue({});
    const result = await notificationService.updateNotification("id", {
      read: true,
    });
    expect(notificationRepository.updateNotification).toHaveBeenCalledWith(
      "id",
      { read: true }
    );
    expect(result).toEqual({});
  });

  test("deleteNotification should call repository", async () => {
    notificationRepository.deleteNotification.mockResolvedValue({});
    const result = await notificationService.deleteNotification("id");
    expect(notificationRepository.deleteNotification).toHaveBeenCalledWith(
      "id"
    );
    expect(result).toEqual({});
  });

  describe("notificationService error handling", () => {
    beforeEach(() => jest.clearAllMocks());

    test("createNotification should propagate repository error", async () => {
      notificationRepository.createNotification.mockRejectedValue(
        new Error("DB error")
      );
      const notif = {
        receiverId: "r",
        senderId: "s",
        content: "c",
        title: "t",
        category: "inbox",
      };
      await expect(
        notificationService.createNotification(notif)
      ).rejects.toThrow("DB error");
    });

    test("findNotificationsBySenderId should propagate repository error", async () => {
      notificationRepository.getSentNotifications.mockRejectedValue(
        new Error("DB error")
      );
      await expect(
        notificationService.findNotificationsBySenderId("s")
      ).rejects.toThrow("DB error");
    });

    test("findNotificationsByReceiverId should propagate repository error", async () => {
      notificationRepository.getNotifications.mockRejectedValue(
        new Error("DB error")
      );
      await expect(
        notificationService.findNotificationsByReceiverId("r")
      ).rejects.toThrow("DB error");
    });

    test("updateNotification should propagate repository error", async () => {
      notificationRepository.updateNotification.mockRejectedValue(
        new Error("DB error")
      );
      await expect(
        notificationService.updateNotification("id", { read: true })
      ).rejects.toThrow("DB error");
    });

    test("deleteNotification should propagate repository error", async () => {
      notificationRepository.deleteNotification.mockRejectedValue(
        new Error("DB error")
      );
      await expect(
        notificationService.deleteNotification("id")
      ).rejects.toThrow("DB error");
    });

    test("updateNotification should return null if repository returns null", async () => {
      notificationRepository.updateNotification.mockResolvedValue(null);
      const result = await notificationService.updateNotification("id", {
        read: true,
      });
      expect(result).toBeNull();
    });

    test("deleteNotification should return null if repository returns null", async () => {
      notificationRepository.deleteNotification.mockResolvedValue(null);
      const result = await notificationService.deleteNotification("id");
      expect(result).toBeNull();
    });
  });
});
