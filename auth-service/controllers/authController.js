const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { HTTP_STATUS } = require('../utils/constants');

router.post('/register', async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(HTTP_STATUS.CREATED).json({ message: 'User registered', userId: user._id });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshToken(token);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await authService.logout(token);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;