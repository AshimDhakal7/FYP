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

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getGrounds);        // GET /api/grounds
router.get("/:id", getGroundById);  // GET /api/grounds/:id

// Protected routes (any logged-in user for now)
router.post("/", protect, createGround);      // POST /api/grounds
router.put("/:id", protect, updateGround);    // PUT /api/grounds/:id
router.delete("/:id", protect, deleteGround); // DELETE /api/grounds/:id

module.exports = router;
