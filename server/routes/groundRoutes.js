// server/routes/groundRoutes.js
const express = require("express");
const router = express.Router();

const {
  createGround,
  getGrounds,
  getGroundById,
  updateGround,
  deleteGround,
} = require("../controllers/groundController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public
router.get("/", getGrounds);
router.get("/:id", getGroundById);

// Admin
router.post("/", protect, admin, createGround);
router.put("/:id", protect, admin, updateGround);
router.delete("/:id", protect, admin, deleteGround);

module.exports = router;
