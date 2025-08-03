const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
const request = require("supertest");
const mongoose = require("mongoose");

// Set test port to avoid conflicts
process.env.PORT = 3002;

let server;

describe("auth middleware", () => {
  // Setup: Start a new server instance before each test
  beforeEach(async () => {
    server = require("../../index");
    await Genre.deleteMany({});
  });

  // Cleanup: After each test: Close the server to prevent hanging connections
  afterEach(async () => {
    try {
      // await Genre.deleteMany({});
      if (server && server.close) {
        await server.close();
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }
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

  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
