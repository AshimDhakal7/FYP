// import Ground from "../models/Ground.js";

// // PUBLIC: list grounds (supports ?q= search)
// export const listGrounds = async (req, res) => {
//   try {
//     const q = (req.query.q || "").trim();

//     const filter = { isActive: true };

//     if (q) {
//       filter.$or = [
//         { name: { $regex: q, $options: "i" } },
//         { area: { $regex: q, $options: "i" } },
//         { features: { $in: [new RegExp(q, "i")] } },
//       ];
//     }

//     const grounds = await Ground.find(filter).sort({ createdAt: -1 });
//     return res.json(grounds);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // OWNER: create ground
// export const createGround = async (req, res) => {
//   try {
//     const ownerId = req.user.id;
//     const { name, area, pricePerHour, features } = req.body;

//     if (!name || !area || pricePerHour === undefined) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     const ground = await Ground.create({
//       owner: ownerId,
//       name,
//       area,
//       pricePerHour: Number(pricePerHour),
//       features: Array.isArray(features)
//         ? features
//         : String(features || "")
//             .split(",")
//             .map((s) => s.trim())
//             .filter(Boolean),
//       isActive: true,
//     });

//     return res.status(201).json(ground);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // OWNER: list my grounds
// export const listMyGrounds = async (req, res) => {
//   try {
//     const ownerId = req.user.id;
//     const grounds = await Ground.find({ owner: ownerId }).sort({ createdAt: -1 });
//     return res.json(grounds);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // OWNER: delete my ground
// export const deleteGround = async (req, res) => {
//   try {
//     const ownerId = req.user.id;
//     const { id } = req.params;

//     const ground = await Ground.findById(id);
//     if (!ground) return res.status(404).json({ message: "Ground not found" });

//     if (String(ground.owner) !== String(ownerId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     await Ground.deleteOne({ _id: id });
//     return res.json({ message: "Deleted" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
import Ground from "../models/Ground.js";

export const createGround = async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;

    const { name, location, pricePerHour } = req.body;

    if (!ownerId) return res.status(401).json({ message: "Not authorized" });
    if (!name || !location || pricePerHour === undefined) {
      return res.status(400).json({ message: "Missing fields: name, location, pricePerHour" });
    }

    const ground = await Ground.create({
      name,
      location,
      pricePerHour: Number(pricePerHour),
      ownerId,
    });

    return res.status(201).json(ground);
  } catch (err) {
    console.error("CREATE GROUND ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getAllGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find().sort({ createdAt: -1 });
    return res.json(grounds);
  } catch (err) {
    console.error("GET GROUNDS ERROR:", err);
    return res.status(500).json({ message: "Server error loading grounds" });
  }
};

export const getMyGrounds = async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;
    if (!ownerId) return res.status(401).json({ message: "Not authorized" });

    const grounds = await Ground.find({ ownerId }).sort({ createdAt: -1 });
    return res.json(grounds);
  } catch (err) {
    console.error("GET MY GROUNDS ERROR:", err);
    return res.status(500).json({ message: "Server error loading your grounds" });
  }
};