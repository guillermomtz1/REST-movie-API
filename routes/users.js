/** Users API Routes
 *
 * This module handles user management endpoints for the Vidly application.
 * It provides functionality for user registration and profile management.
 *
 * Routes:
 * POST /api/users - Register a new user
 * GET  /api/users/me - Get current user's profile
 */

const { User, validate } = require("../models/user");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const authorization = require("../middleware/authorization");

/** GET /api/users/me
 * Returns the current user's profile
 * Requires authentication
 *
 * Returns:
 * - 401: Not authenticated
 * - 200: User profile (excluding password)
 */
router.get("/me", authorization, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

/** POST /api/users
 * Registers a new user
 *
 * Request body:
 * - name: User's full name
 * - email: User's email address
 * - password: User's password
 *
 * Returns:
 * - 400: Invalid request data
 * - 200: Created user object (excluding password)
 */
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
