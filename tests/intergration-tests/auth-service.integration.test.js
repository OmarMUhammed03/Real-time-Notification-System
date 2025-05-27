const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('../../auth-service/controllers/authController');
const AuthUser = require('../../auth-service/models/AuthUser');
const { HTTP_STATUS } = require('../../auth-service/utils/constants');

jest.mock('../../auth-service/utils/kafkaProducer', () => ({ sendEvent: jest.fn() }));

let app;
let mongod;

const userData = {
  email: 'test@example.com',
  password: 'Password123!',
  name: 'Test User',
  birthDate: '2000-01-01',
  gender: 'other',
};

describe('Auth Service Integration', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/', authRouter);
    process.env.JWT_SECRET = 'testsecret';
    process.env.ACCESS_TOKEN_DURATION = '1h';
    process.env.REFRESH_TOKEN_DURATION = '1d';
    process.env.ACCESS_TOKEN_MAX_AGE = 1000000;
    process.env.REFRESH_TOKEN_MAX_AGE = 1000000;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    await AuthUser.deleteMany({});
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/register').send(userData);
      expect(res.status).toBe(HTTP_STATUS.CREATED);
      expect(res.body.userId).toBeDefined();
    });
    it('should not register with missing fields', async () => {
      const res = await request(app).post('/register').send({ email: 'a', password: 'b' });
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });
    it('should not register duplicate email', async () => {
      await request(app).post('/register').send(userData);
      const res = await request(app).post('/register').send(userData);
      expect(res.status).toBe(HTTP_STATUS.CONFLICT);
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app).post('/register').send(userData);
    });
    it('should login with correct credentials', async () => {
      const res = await request(app).post('/login').send({ email: userData.email, password: userData.password });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.headers['set-cookie']).toBeDefined();
    });
    it('should not login with wrong password', async () => {
      const res = await request(app).post('/login').send({ email: userData.email, password: 'wrong' });
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });
    it('should not login with non-existent user', async () => {
      const res = await request(app).post('/login').send({ email: 'no@no.com', password: 'pass' });
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  describe('POST /refresh-token', () => {
    let refreshToken;
    beforeEach(async () => {
      await request(app).post('/register').send(userData);
      const loginRes = await request(app).post('/login').send({ email: userData.email, password: userData.password });
      const cookies = loginRes.headers['set-cookie'];
      refreshToken = cookies.find(c => c.startsWith('refresh_token')).split(';')[0].split('=')[1];
    });
    it('should refresh token with valid refresh token', async () => {
      const res = await request(app).post('/refresh-token').send({ refreshToken });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.token).toBeDefined();
    });
    it('should not refresh with invalid token', async () => {
      const res = await request(app).post('/refresh-token').send({ refreshToken: 'invalid' });
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  describe('POST /logout', () => {
    let refreshToken, accessToken, cookies;
    beforeEach(async () => {
      await request(app).post('/register').send(userData);
      const loginRes = await request(app).post('/login').send({ email: userData.email, password: userData.password });
      cookies = loginRes.headers['set-cookie'];
      accessToken = cookies.find(c => c.startsWith('access_token')).split(';')[0].split('=')[1];
      refreshToken = cookies.find(c => c.startsWith('refresh_token')).split(';')[0].split('=')[1];
    });
    it('should logout and clear cookies', async () => {
      const res = await request(app).post('/logout').set('Cookie', [`access_token=${accessToken}`, `refresh_token=${refreshToken}`]);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(/Logged out/);
    });
    it('should handle logout with no token', async () => {
      const res = await request(app).post('/logout');
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(/No token/);
    });
  });

  describe('GET /me', () => {
    let accessToken, cookies;
    beforeEach(async () => {
      await request(app).post('/register').send(userData);
      const loginRes = await request(app).post('/login').send({ email: userData.email, password: userData.password });
      cookies = loginRes.headers['set-cookie'];
      accessToken = cookies.find(c => c.startsWith('access_token')).split(';')[0].split('=')[1];
    });
    it('should return current user with valid token', async () => {
      const res = await request(app).get('/me').set('Cookie', [`access_token=${accessToken}`]);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.email).toBe(userData.email);
    });
    it('should return 401 with no token', async () => {
      const res = await request(app).get('/me');
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });
  });
});
