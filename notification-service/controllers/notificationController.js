const express = require("express");

const notificationService = require("../services/notificationService");
const { HTTP_STATUS } = require("../utils/constants");

const router = express.Router();

router.get("/receiver-email/:email", async (req, res, next) => {
  try {
    const notifications = await notificationService.findUserNotifications(
      req.params.email
    );
    res.status(HTTP_STATUS.OK).json(notifications);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const notification = await notificationService.findNotification(
      req.params.id
    );
    res.status(HTTP_STATUS.OK).json(notification);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const notification = await notificationService.updateNotification(
      req.params.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json(notification);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const notification = await notificationService.deleteNotification(
      req.params.id
    );
    res.status(HTTP_STATUS.OK).json(notification);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
