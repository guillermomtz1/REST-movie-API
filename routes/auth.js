/** Authentication API Routes
 *
 * This module handles user authentication endpoints for the Vidly application.
 * It provides functionality for user login and token generation.
 *
 * Routes:
 * POST /api/auth - Authenticate user and return JWT token
 */

const { User } = require("../models/user");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

/** POST /api/auth
 * Authenticates a user and returns a JWT token
 *
 * Request body:
 * - email: User's email address
 * - password: User's password
 *
 * Returns:
 * - 400: Invalid email or password
 * - 200: JWT token for authenticated user
 */
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

/**
 * Validates the request body for authentication
 * Ensures email and password meet requirements
 */
function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });

  return schema.validate(req);
}

module.exports = router;
