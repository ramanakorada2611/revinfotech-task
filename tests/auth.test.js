const request = require("supertest");
const app = require("../src/index");
const User = require("../src/models/User");

describe("Auth Endpoints", () => {
  describe("POST /api/auth/register", () => {
    const validUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refresh_token");

      const user = await User.findOne({ email: validUser.email });
      expect(user).toBeTruthy();
      expect(user.username).toBe(validUser.username);
    });

    it("should not register user with existing email", async () => {
      await request(app).post("/api/auth/register").send(validUser);

      const res = await request(app).post("/api/auth/register").send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refresh_token");
    });

    it("should not login with invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    let refreshToken;

    beforeEach(async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      refreshToken = res.body.refreshToken;
    });

    it("should refresh access token with valid refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh-token")
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refresh_token");
    });

    it("should not refresh token with invalid refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh-token")
        .send({ refreshToken: "invalid-token" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid refresh token");
    });
  });
});
