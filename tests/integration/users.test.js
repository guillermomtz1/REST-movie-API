const { User } = require("../../models/user");
const request = require("supertest");
const mongoose = require("mongoose");

// Set test port to avoid conflicts
process.env.PORT = 3001;

describe("/api/users", () => {
  let server;

  // Setup: Start a new server instance before each test
  beforeEach(async () => {
    // Create fresh app instance
    server = require("../../index");
    await User.deleteMany({});
  });

  // Cleanup: After each test: Close the server to prevent hanging connections
  afterEach(async () => {
    // await User.deleteMany({});
    await server.close();
  });

  // Final cleanup: Close MongoDB connection after all tests complete
  afterAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
    } catch (error) {
      console.error("Error closing mongoose connection:", error);
    }
  });

  describe("POST /", () => {
    it("should create a new user with valid data", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const res = await request(server).post("/api/users").send(userData);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe(userData.name);
      expect(res.body.email).toBe(userData.email);
      expect(res.body).not.toHaveProperty("password"); // Password should not be returned
      expect(res.headers).toHaveProperty("x-auth-token"); // Should return JWT token
    });

    it("should return 400 if email is already registered", async () => {
      // First, create a user
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      await request(server).post("/api/users").send(userData);

      // Try to create another user with the same email
      const res = await request(server).post("/api/users").send(userData);

      expect(res.status).toBe(400);
      expect(res.text).toBe("User already registered.");
    });

    it("should return 400 if name is too short", async () => {
      const userData = {
        name: "A", // Too short (min 2 characters)
        email: "test@example.com",
        password: "password123",
      };

      const res = await request(server).post("/api/users").send(userData);

      expect(res.status).toBe(400);
    });

    it("should return 400 if email is invalid", async () => {
      const userData = {
        name: "Test User",
        email: "invalid-email", // Invalid email
        password: "password123",
      };

      const res = await request(server).post("/api/users").send(userData);

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is too short", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "123", // Too short (min 5 characters)
      };

      const res = await request(server).post("/api/users").send(userData);

      expect(res.status).toBe(400);
    });
  });
});
