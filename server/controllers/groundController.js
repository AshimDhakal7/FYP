// server/controllers/groundController.js
const Ground = require("../models/Ground");

const createGround = async (req, res) => {
  try {
    const { name, location, description, hourlyRate, images } = req.body;

    const ground = await Ground.create({
      name,
      location,
      description,
      hourlyRate,
      images,
    });

    return res.status(201).json(ground);
  } catch (err) {
    console.error("Create ground error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find({ isActive: true }).sort({
      createdAt: -1,
    });
    return res.json(grounds);
  } catch (err) {
    console.error("Get grounds error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getGroundById = async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);
    if (!ground)
      return res.status(404).json({ message: "Ground not found" });

    return res.json(ground);
  } catch (err) {
    console.error("Get ground error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateGround = async (req, res) => {
  try {
    const ground = await Ground.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!ground)
      return res.status(404).json({ message: "Ground not found" });

    return res.json(ground);
  } catch (err) {
    console.error("Update ground error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deleteGround = async (req, res) => {
  try {
    const ground = await Ground.findByIdAndDelete(req.params.id);
    if (!ground)
      return res.status(404).json({ message: "Ground not found" });

    return res.json({ message: "Ground removed" });
  } catch (err) {
    console.error("Delete ground error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createGround,
  getGrounds,
  getGroundById,
  updateGround,
  deleteGround,
};
