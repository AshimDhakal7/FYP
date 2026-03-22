
// import Ground from "../models/Ground.js";

// export const createGround = async (req, res) => {
//   try {
//     const ownerId = req.user?._id || req.user?.id;

//     const { name, location, pricePerHour } = req.body;

//     if (!ownerId) return res.status(401).json({ message: "Not authorized" });
//     if (!name || !location || pricePerHour === undefined) {
//       return res.status(400).json({ message: "Missing fields: name, location, pricePerHour" });
//     }

//     const ground = await Ground.create({
//       name,
//       location,
//       pricePerHour: Number(pricePerHour),
//       ownerId,
//     });

//     return res.status(201).json(ground);
//   } catch (err) {
//     console.error("CREATE GROUND ERROR:", err);
//     return res.status(500).json({ message: err.message || "Server error" });
//   }
// };

// export const getAllGrounds = async (req, res) => {
//   try {
//     const grounds = await Ground.find().sort({ createdAt: -1 });
//     return res.json(grounds);
//   } catch (err) {
//     console.error("GET GROUNDS ERROR:", err);
//     return res.status(500).json({ message: "Server error loading grounds" });
//   }
// };

// export const getMyGrounds = async (req, res) => {
//   try {
//     const ownerId = req.user?._id || req.user?.id;
//     if (!ownerId) return res.status(401).json({ message: "Not authorized" });

//     const grounds = await Ground.find({ ownerId }).sort({ createdAt: -1 });
//     return res.json(grounds);
//   } catch (err) {
//     console.error("GET MY GROUNDS ERROR:", err);
//     return res.status(500).json({ message: "Server error loading your grounds" });
//   }
// };

import Ground from "../models/Ground.js";

// ✅ CREATE
export const createGround = async (req, res) => {
  try {
    const ground = await Ground.create({
      name,
      location,
      pricePerHour,
      phone: req.body.phone,   
      ownerId: req.user._id,
    });

    res.json(ground);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create ground" });
  }
};

// ✅ GET ALL (public)
export const getAllGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find().sort({ createdAt: -1 });
    res.json(grounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch grounds" });
  }
};

// ✅ GET MY GROUNDS
export const getMyGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(grounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your grounds" });
  }
};

// ✅ UPDATE
export const updateGround = async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    // optional: ensure owner
    if (ground.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    ground.name = req.body.name || ground.name;
    ground.phone = req.body.phone || ground.phone;
    ground.location = req.body.location || ground.location;
    ground.pricePerHour =
      req.body.pricePerHour || ground.pricePerHour;
    ground.images = req.body.images || ground.images; // ✅ important

    const updated = await ground.save();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ground" });
  }
};

// ✅ DELETE
export const deleteGround = async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    if (ground.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await ground.deleteOne();

    res.json({ message: "Ground removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete ground" });
  }
};