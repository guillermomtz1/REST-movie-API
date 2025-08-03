const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

// Set test port to avoid conflicts
process.env.PORT = 3003;

let server;

describe("/api/genres", () => {
  // In this test suite we will group all the testss for sending  GET, POST, PUT & DELETE
  // requests and different test suites.

  // Setup: Start a new server instance before each test
  // Jasmin & JEST function
  beforeEach(async () => {
    server = require("../../index");
    await Genre.deleteMany({});
  });

  // Cleanup: After each test:
  // 1. Close the server to prevent hanging connections
  // 2. Clear the database to ensure a clean state for the next test
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

  describe("GET /", () => {
    it("should return all genres", async () => {
      const genres = [{ name: "genre1" }, { name: "genre2" }];

      await Genre.collection.insertMany(genres);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid ID is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid ID is passed", async () => {
      /** Test: Invalid ID handling
       *
       * This test verifies that the API correctly handles invalid genre IDs.
       * We don't need to populate the database because:
       * 1. An invalid ID format will fail before database lookup
       * 2. The test focuses on API behavior, not data existence
       */
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given ID exists", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    /**
     * Define the happy path, and then in each test, we change one parameter
     * that clearly aligns with the name of the test.
     */

    // These 2 parameters vary between some of the tests, so these are initialized
    // before and can be changed on a case by case basis
    let token;
    let name;

    // HAPPY PATH:
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    // Set parameters token and name before each test
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      /** Test: Authorization middleware
       *
       * This test verifies that the user is logged in.
       * If user is not logged in, this will return a 401 error - Unauthorized
       */

      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      /** Test: Invalid inputs
       *
       * This test verifies that the genre is at least 5 characters
       * We need to create an authentication token first
       */
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      // Dynamically create an array longer than 50 characters
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const res = await exec();

      // Look for name in database
      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
