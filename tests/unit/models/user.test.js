const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

/**
 * Test suite for user authentication token generation
 * These tests verify that the JWT token generation works correctly
 * and contains the expected user information
 */
describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    // Create a test payload with a random MongoDB ObjectId
    // and admin privileges for testing
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    // Create a new user instance with the test payload
    const user = new User(payload);

    // Generate the authentication token using the user's method
    const token = user.generateAuthToken();

    // Verify the token by decoding it and checking its contents
    // This ensures the token contains the correct user information
    // and was signed with the correct private key
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});
