// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private
router.get("/me", protect, getProfile);

module.exports = router;
