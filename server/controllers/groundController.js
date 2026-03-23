
// // // // import Ground from "../models/Ground.js";

// // // // // ✅ CREATE
// // // // export const createGround = async (req, res) => {
// // // //   try {
// // // //     const ground = await Ground.create({
// // // //       name,
// // // //       location,
// // // //       pricePerHour,
// // // //       phone: req.body.phone,   
// // // //       ownerId: req.user._id,
// // // //     });

// // // //     res.json(ground);
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ message: "Failed to create ground" });
// // // //   }
// // // // };

// // // // // ✅ GET ALL (public)
// // // // export const getAllGrounds = async (req, res) => {
// // // //   try {
// // // //     const grounds = await Ground.find().sort({ createdAt: -1 });
// // // //     res.json(grounds);
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ message: "Failed to fetch grounds" });
// // // //   }
// // // // };

// // // // // ✅ GET MY GROUNDS
// // // // export const getMyGrounds = async (req, res) => {
// // // //   try {
// // // //     const grounds = await Ground.find({ ownerId: req.user._id }).sort({
// // // //       createdAt: -1,
// // // //     });
// // // //     res.json(grounds);
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ message: "Failed to fetch your grounds" });
// // // //   }
// // // // };

// // // // // ✅ UPDATE
// // // // export const updateGround = async (req, res) => {
// // // //   try {
// // // //     const ground = await Ground.findById(req.params.id);

// // // //     if (!ground) {
// // // //       return res.status(404).json({ message: "Ground not found" });
// // // //     }

// // // //     // optional: ensure owner
// // // //     if (ground.ownerId.toString() !== req.user._id.toString()) {
// // // //       return res.status(401).json({ message: "Not authorized" });
// // // //     }

// // // //     ground.name = req.body.name || ground.name;
// // // //     ground.phone = req.body.phone || ground.phone;
// // // //     ground.location = req.body.location || ground.location;
// // // //     ground.pricePerHour =
// // // //       req.body.pricePerHour || ground.pricePerHour;
// // // //     ground.images = req.body.images || ground.images; // ✅ important

// // // //     const updated = await ground.save();

// // // //     res.json(updated);
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ message: "Failed to update ground" });
// // // //   }
// // // // };

// // // // // DELETE
// // // // export const deleteGround = async (req, res) => {
// // // //   try {
// // // //     const ground = await Ground.findById(req.params.id);

// // // //     if (!ground) {
// // // //       return res.status(404).json({ message: "Ground not found" });
// // // //     }

// // // //     if (ground.ownerId.toString() !== req.user._id.toString()) {
// // // //       return res.status(401).json({ message: "Not authorized" });
// // // //     }

// // // //     await ground.deleteOne();

// // // //     res.json({ message: "Ground removed" });
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ message: "Failed to delete ground" });
// // // //   }
// // // // };



// // // import Ground from "../models/Ground.js";

// // // // CREATE
// // // export const createGround = async (req, res) => {
// // //   try {
// // //     const { name, location, phone, pricePerHour, images } = req.body;

// // //     if (!name || !location || !pricePerHour) {
// // //       return res.status(400).json({ message: "Please fill all required fields" });
// // //     }

// // //     const ground = await Ground.create({
// // //       name: name.trim(),
// // //       location: location.trim(),
// // //       phone: phone?.trim() || "",
// // //       pricePerHour: Number(pricePerHour),
// // //       images: Array.isArray(images) ? images : [],
// // //       ownerId: req.user._id,
// // //     });

// // //     res.status(201).json(ground);
// // //   } catch (err) {
// // //     console.error("CREATE GROUND ERROR:", err);
// // //     res.status(500).json({ message: "Failed to create ground" });
// // //   }
// // // };

// // // // GET ALL
// // // export const getAllGrounds = async (req, res) => {
// // //   try {
// // //     const grounds = await Ground.find().sort({ createdAt: -1 });
// // //     res.json(grounds);
// // //   } catch (err) {
// // //     console.error("GET ALL GROUNDS ERROR:", err);
// // //     res.status(500).json({ message: "Failed to fetch grounds" });
// // //   }
// // // };

// // // // GET MY GROUNDS
// // // export const getMyGrounds = async (req, res) => {
// // //   try {
// // //     const grounds = await Ground.find({ ownerId: req.user._id }).sort({
// // //       createdAt: -1,
// // //     });
// // //     res.json(grounds);
// // //   } catch (err) {
// // //     console.error("GET MY GROUNDS ERROR:", err);
// // //     res.status(500).json({ message: "Failed to fetch your grounds" });
// // //   }
// // // };

// // // // UPDATE
// // // export const updateGround = async (req, res) => {
// // //   try {
// // //     const ground = await Ground.findById(req.params.id);

// // //     if (!ground) {
// // //       return res.status(404).json({ message: "Ground not found" });
// // //     }

// // //     if (ground.ownerId.toString() !== req.user._id.toString()) {
// // //       return res.status(401).json({ message: "Not authorized" });
// // //     }

// // //     ground.name = req.body.name?.trim() || ground.name;
// // //     ground.location = req.body.location?.trim() || ground.location;
// // //     ground.phone = req.body.phone?.trim() || ground.phone;
// // //     ground.pricePerHour =
// // //       req.body.pricePerHour !== undefined
// // //         ? Number(req.body.pricePerHour)
// // //         : ground.pricePerHour;
// // //     ground.images = Array.isArray(req.body.images) ? req.body.images : ground.images;

// // //     const updated = await ground.save();
// // //     res.json(updated);
// // //   } catch (err) {
// // //     console.error("UPDATE GROUND ERROR:", err);
// // //     res.status(500).json({ message: "Failed to update ground" });
// // //   }
// // // };

// // // // DELETE
// // // export const deleteGround = async (req, res) => {
// // //   try {
// // //     const ground = await Ground.findById(req.params.id);

// // //     if (!ground) {
// // //       return res.status(404).json({ message: "Ground not found" });
// // //     }

// // //     if (ground.ownerId.toString() !== req.user._id.toString()) {
// // //       return res.status(401).json({ message: "Not authorized" });
// // //     }

// // //     await ground.deleteOne();
// // //     res.json({ message: "Ground removed" });
// // //   } catch (err) {
// // //     console.error("DELETE GROUND ERROR:", err);
// // //     res.status(500).json({ message: "Failed to delete ground" });
// // //   }
// // // };



// // import Ground from "../models/Ground.js";

// // // CREATE
// // export const createGround = async (req, res) => {
// //   try {
// //     const { name, location, phone, pricePerHour, images } = req.body;

// //     if (!name || !location || pricePerHour === undefined) {
// //       return res
// //         .status(400)
// //         .json({ message: "Please fill all required fields" });
// //     }

// //     const ground = await Ground.create({
// //       name: name.trim(),
// //       location: location.trim(),
// //       phone: phone?.trim() || "",
// //       pricePerHour: Number(pricePerHour),
// //       images: Array.isArray(images) ? images : [],
// //       ownerId: req.user._id,
// //     });

// //     res.status(201).json(ground);
// //   } catch (err) {
// //     console.error("CREATE GROUND ERROR:", err);
// //     res.status(500).json({ message: "Failed to create ground" });
// //   }
// // };

// // // GET ALL
// // export const getAllGrounds = async (req, res) => {
// //   try {
// //     const grounds = await Ground.find().sort({ createdAt: -1 });
// //     res.json(grounds);
// //   } catch (err) {
// //     console.error("GET ALL GROUNDS ERROR:", err);
// //     res.status(500).json({ message: "Failed to fetch grounds" });
// //   }
// // };

// // // GET MY GROUNDS
// // export const getMyGrounds = async (req, res) => {
// //   try {
// //     const grounds = await Ground.find({ ownerId: req.user._id }).sort({
// //       createdAt: -1,
// //     });
// //     res.json(grounds);
// //   } catch (err) {
// //     console.error("GET MY GROUNDS ERROR:", err);
// //     res.status(500).json({ message: "Failed to fetch your grounds" });
// //   }
// // };

// // // UPDATE
// // export const updateGround = async (req, res) => {
// //   try {
// //     const ground = await Ground.findById(req.params.id);

// //     if (!ground) {
// //       return res.status(404).json({ message: "Ground not found" });
// //     }

// //     if (ground.ownerId.toString() !== req.user._id.toString()) {
// //       return res.status(401).json({ message: "Not authorized" });
// //     }

// //     ground.name = req.body.name?.trim() || ground.name;
// //     ground.location = req.body.location?.trim() || ground.location;
// //     ground.phone = req.body.phone?.trim() || ground.phone;
// //     ground.pricePerHour =
// //       req.body.pricePerHour !== undefined
// //         ? Number(req.body.pricePerHour)
// //         : ground.pricePerHour;
// //     ground.images = Array.isArray(req.body.images)
// //       ? req.body.images
// //       : ground.images;

// //     const updated = await ground.save();
// //     res.json(updated);
// //   } catch (err) {
// //     console.error("UPDATE GROUND ERROR:", err);
// //     res.status(500).json({ message: "Failed to update ground" });
// //   }
// // };

// // // DELETE
// // export const deleteGround = async (req, res) => {
// //   try {
// //     const ground = await Ground.findById(req.params.id);

// //     if (!ground) {
// //       return res.status(404).json({ message: "Ground not found" });
// //     }

// //     if (ground.ownerId.toString() !== req.user._id.toString()) {
// //       return res.status(401).json({ message: "Not authorized" });
// //     }

// //     await ground.deleteOne();
// //     res.json({ message: "Ground removed" });
// //   } catch (err) {
// //     console.error("DELETE GROUND ERROR:", err);
// //     res.status(500).json({ message: "Failed to delete ground" });
// //   }
// // };




// import Ground from "../models/Ground.js";

// // CREATE GROUND
// export const createGround = async (req, res) => {
//   try {
//     const { name, location, phone, pricePerHour, images } = req.body;

//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     if (!name?.trim() || !location?.trim() || pricePerHour === undefined) {
//       return res
//         .status(400)
//         .json({ message: "Please fill all required fields" });
//     }

//     const ground = await Ground.create({
//       name: name.trim(),
//       location: location.trim(),
//       phone: phone?.trim() || "",
//       pricePerHour: Number(pricePerHour),
//       images: Array.isArray(images) ? images : [],
//       ownerId: req.user._id,
//     });

//     res.status(201).json(ground);
//   } catch (err) {
//     console.error("CREATE GROUND ERROR:", err);
//     res.status(500).json({ message: err.message || "Failed to create ground" });
//   }
// };

// // GET ALL GROUNDS
// export const getAllGrounds = async (req, res) => {
//   try {
//     const grounds = await Ground.find().sort({ createdAt: -1 });
//     res.json(grounds);
//   } catch (err) {
//     console.error("GET ALL GROUNDS ERROR:", err);
//     res.status(500).json({ message: err.message || "Failed to fetch grounds" });
//   }
// };

// // GET MY GROUNDS
// export const getMyGrounds = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     const grounds = await Ground.find({ ownerId: req.user._id }).sort({
//       createdAt: -1,
//     });

//     res.json(grounds);
//   } catch (err) {
//     console.error("GET MY GROUNDS ERROR:", err);
//     res
//       .status(500)
//       .json({ message: err.message || "Failed to fetch your grounds" });
//   }
// };

// // UPDATE GROUND
// export const updateGround = async (req, res) => {
//   try {
//     const { name, location, phone, pricePerHour, images } = req.body;

//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     const ground = await Ground.findById(req.params.id);

//     if (!ground) {
//       return res.status(404).json({ message: "Ground not found" });
//     }

//     if (ground.ownerId.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     if (name !== undefined) ground.name = name.trim();
//     if (location !== undefined) ground.location = location.trim();
//     if (phone !== undefined) ground.phone = phone.trim();
//     if (pricePerHour !== undefined) ground.pricePerHour = Number(pricePerHour);
//     if (images !== undefined) ground.images = Array.isArray(images) ? images : [];

//     const updatedGround = await ground.save();
//     res.json(updatedGround);
//   } catch (err) {
//     console.error("UPDATE GROUND ERROR:", err);
//     res.status(500).json({ message: err.message || "Failed to update ground" });
//   }
// };

// // DELETE GROUND
// export const deleteGround = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     const ground = await Ground.findById(req.params.id);

//     if (!ground) {
//       return res.status(404).json({ message: "Ground not found" });
//     }

//     if (ground.ownerId.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     await ground.deleteOne();
//     res.json({ message: "Ground removed" });
//   } catch (err) {
//     console.error("DELETE GROUND ERROR:", err);
//     res.status(500).json({ message: err.message || "Failed to delete ground" });
//   }
// };


import Ground from "../models/Ground.js";

// CREATE
export const createGround = async (req, res) => {
  try {
    const { name, location, phone, pricePerHour, images } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!name?.trim() || !location?.trim() || pricePerHour === undefined) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const ground = await Ground.create({
      name: name.trim(),
      location: location.trim(),
      phone: phone?.trim() || "",
      pricePerHour: Number(pricePerHour),
      images: Array.isArray(images) ? images : [],
      ownerId: req.user._id,
    });

    res.status(201).json(ground);
  } catch (err) {
    console.error("CREATE GROUND ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to create ground" });
  }
};

// GET ALL
export const getAllGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find().sort({ createdAt: -1 });
    res.json(grounds);
  } catch (err) {
    console.error("GET ALL GROUNDS ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to fetch grounds" });
  }
};

// GET MY GROUNDS
export const getMyGrounds = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const grounds = await Ground.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(grounds);
  } catch (err) {
    console.error("GET MY GROUNDS ERROR:", err);
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch your grounds" });
  }
};

// UPDATE
export const updateGround = async (req, res) => {
  try {
    const { name, location, phone, pricePerHour, images } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    if (ground.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (name !== undefined) ground.name = name.trim();
    if (location !== undefined) ground.location = location.trim();
    if (phone !== undefined) ground.phone = phone.trim();
    if (pricePerHour !== undefined) ground.pricePerHour = Number(pricePerHour);
    if (images !== undefined) {
      ground.images = Array.isArray(images) ? images : [];
    }

    const updatedGround = await ground.save();
    res.json(updatedGround);
  } catch (err) {
    console.error("UPDATE GROUND ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to update ground" });
  }
};

// DELETE
export const deleteGround = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    if (ground.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await ground.deleteOne();
    res.json({ message: "Ground removed" });
  } catch (err) {
    console.error("DELETE GROUND ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to delete ground" });
  }
};