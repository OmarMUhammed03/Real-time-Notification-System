const express = require("express");

const router = express.Router();

const userService = require("../services/userService");
const { HTTP_STATUS } = require("../utils/constants");

router.get("/", async (req, res, next) => {
  try {
    const users = await userService.findAllUsers();
    res.status(HTTP_STATUS.OK).json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(HTTP_STATUS.CREATED).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.params.id);
    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/email/:email", async (req, res, next) => {
  try {
    const user = await userService.findUserByEmail(req.params.email);
    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
