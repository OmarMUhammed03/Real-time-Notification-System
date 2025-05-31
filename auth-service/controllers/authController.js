const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const { HTTP_STATUS } = require("../utils/constants");

router.get("/me", async (req, res, next) => {
  try {
    console.log("cookies", req.cookies);
    const { id, email } = await authService.getCurrentUser(
      req.cookies.access_token
    );
    res.setHeader("X-User-Id", id);
    res.setHeader("X-User-Email", email);
    res.status(HTTP_STATUS.OK).json({ id, email });
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User registered", userId: user._id });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { token, refreshToken } = await authService.login(req.body);
    console.log("login successful", token, refreshToken);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: process.env.ACCESS_TOKEN_MAX_AGE,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
    });
    res.status(HTTP_STATUS.OK).json({ access_token: token, refresh_token: refreshToken });
  } catch (err) {
    next(err);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshToken(token);
    console.log("refresh token successful", result);
    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: process.env.ACCESS_TOKEN_MAX_AGE,
    });
    res.status(HTTP_STATUS.OK).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const { refresh_token: token } = req.cookies;
    const result = await authService.logout(token);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(HTTP_STATUS.OK).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
