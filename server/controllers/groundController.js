
// import Ground from "../models/Ground.js";

// const getUserId = (req) => req.user?._id || req.user?.id;

// /* ================= CREATE GROUND ================= */
// export const createGround = async (req, res) => {
//   try {
//     const {
//       name,
//       location,
//       latitude,
//       longitude,
//       phone,
//       pricePerHour,
//       images,
//     } = req.body;

//     const ownerId = getUserId(req);

//     if (!ownerId) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     if (
//       !name?.trim() ||
//       !location?.trim() ||
//       latitude === undefined ||
//       longitude === undefined ||
//       pricePerHour === undefined
//     ) {
//       return res.status(400).json({
//         message:
//           "Please fill all required fields including latitude and longitude",
//       });
//     }

//     const lat = Number(latitude);
//     const lng = Number(longitude);
//     const price = Number(pricePerHour);

//     if (Number.isNaN(lat) || lat < -90 || lat > 90) {
//       return res
//         .status(400)
//         .json({ message: "Latitude must be between -90 and 90" });
//     }

//     if (Number.isNaN(lng) || lng < -180 || lng > 180) {
//       return res
//         .status(400)
//         .json({ message: "Longitude must be between -180 and 180" });
//     }

//     if (Number.isNaN(price) || price <= 0) {
//       return res
//         .status(400)
//         .json({ message: "Price must be a valid positive number" });
//     }

//     const ground = await Ground.create({
//       name: name.trim(),
//       location: location.trim(),
//       latitude: lat,
//       longitude: lng,
//       phone: phone?.trim() || "",
//       pricePerHour: price,
//       images: Array.isArray(images) ? images : [],
//       ownerId,
//       status: "pending",
//     });

//     return res.status(201).json({
//       message: "Ground submitted for admin approval",
//       ground,
//     });
//   } catch (error) {
//     console.error("CREATE GROUND ERROR:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Failed to create ground" });
//   }
// };

// /* ================= GET ALL GROUNDS (PUBLIC) ================= */
// export const getAllGrounds = async (req, res) => {
//   try {
//     const grounds = await Ground.find({ status: "approved" }).sort({
//       createdAt: -1,
//     });

//     return res.json(grounds);
//   } catch (error) {
//     console.error("GET ALL GROUNDS ERROR:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Failed to fetch grounds" });
//   }
// };

// /* ================= GET ONE GROUND ================= */
// export const getGroundById = async (req, res) => {
//   try {
//     const ground = await Ground.findById(req.params.id);

//     if (!ground) {
//       return res.status(404).json({ message: "Ground not found" });
//     }

//     return res.json(ground);
//   } catch (error) {
//     console.error("GET GROUND BY ID ERROR:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Failed to fetch ground" });
//   }
// };

// /* ================= GET MY GROUNDS (OWNER) ================= */
// export const getMyGrounds = async (req, res) => {
//   try {
//     const ownerId = getUserId(req);

//     if (!ownerId) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     const grounds = await Ground.find({ ownerId }).sort({
//       createdAt: -1,
//     });

//     return res.json(grounds);
//   } catch (error) {
//     console.error("GET MY GROUNDS ERROR:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Failed to fetch your grounds" });
//   }
// };

// /* ================= UPDATE GROUND (OWNER) ================= */
// export const updateGround = async (req, res) => {
//   try {
//     const {
//       name,
//       location,
//       latitude,
//       longitude,
//       phone,
//       pricePerHour,
//       images,
//     } = req.body;

//     const ownerId = getUserId(req);

//     if (!ownerId) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     const ground = await Ground.findById(req.params.id);

//     if (!ground) {
//       return res.status(404).json({ message: "Ground not found" });
//     }

//     if (String(ground.ownerId) !== String(ownerId)) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     if (name !== undefined) ground.name = name.trim();
//     if (location !== undefined) ground.location = location.trim();

//     if (latitude !== undefined) {
//       const lat = Number(latitude);
//       if (Number.isNaN(lat) || lat < -90 || lat > 90) {
//         return res
//           .status(400)
//           .json({ message: "Latitude must be between -90 and 90" });
//       }
//       ground.latitude = lat;
//     }

//     if (longitude !== undefined) {
//       const lng = Number(longitude);
//       if (Number.isNaN(lng) || lng < -180 || lng > 180) {
//         return res
//           .status(400)
//           .json({ message: "Longitude must be between -180 and 180" });
//       }
//       ground.longitude = lng;
//     }

//     if (phone !== undefined) ground.phone = phone.trim();

//     if (pricePerHour !== undefined) {
//       const price = Number(pricePerHour);
//       if (Number.isNaN(price) || price <= 0) {
//         return res
//           .status(400)
//           .json({ message: "Price must be a valid positive number" });
//       }
//       ground.pricePerHour = price;
//     }

//     if (images !== undefined) {
//       ground.images = Array.isArray(images) ? images : [];
//     }

//     ground.status = "pending";

//     const updatedGround = await ground.save();

//     return res.json({
//       message: "Ground updated and sent for re-approval",
//       ground: updatedGround,
//     });
//   } catch (error) {
//     console.error("UPDATE GROUND ERROR:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Failed to update ground" });
//   }
// };

// /* ================= DELETE GROUND (OWNER) ================= */
// export const deleteGround = async (req, res) => {
//   try {
//     const ownerId = getUserId(req);

//     if (!ownerId) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     const ground = await Ground.findById(req.params.id);

//     if (!ground) {
//       return res.status(404).json({ message: "Ground not found" });
//     }

//     if (String(ground.ownerId) !== String(ownerId)) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     await ground.deleteOne();

//     return res.json({ message: "Ground removed" });
//   } catch (error) {
//     console.error("DELETE GROUND ERROR:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Failed to delete ground" });
//   }
// };

// /* ================= ADMIN LIST GROUNDS ================= */
// export const getAdminGrounds = async (req, res) => {
//   try {
//     const status = req.query.status?.toLowerCase();

//     const filter = {};
//     if (status) {
//       filter.status = status;
//     }

//     const grounds = await Ground.find(filter)
//       .populate("ownerId", "name email")
//       .sort({ createdAt: -1 });

//     const formatted = grounds.map((ground) => ({
//       _id: ground._id,
//       name: ground.name,
//       location: ground.location,
//       latitude: ground.latitude,
//       longitude: ground.longitude,
//       phone: ground.phone,
//       pricePerHour: ground.pricePerHour,
//       images: Array.isArray(ground.images) ? ground.images : [],
//       status: ground.status || "pending",
//       createdAt: ground.createdAt,
//       approvedAt: ground.approvedAt || null,
//       rejectedAt: ground.rejectedAt || null,
//       ownerName: ground.ownerId?.name || "Unknown",
//       ownerEmail: ground.ownerId?.email || "—",
//       ownerId: ground.ownerId || null,
//     }));

//     return res.json({ grounds: formatted });
//   } catch (error) {
//     console.error("GET ADMIN GROUNDS ERROR:", error);
//     return res.status(500).json({ message: "Failed to fetch admin grounds" });
//   }
// };

// /* ================= GET PENDING GROUNDS ================= */
// export const getPendingGrounds = async (req, res) => {
//   try {
//     const grounds = await Ground.find({ status: "pending" })
//       .populate("ownerId", "name email")
//       .sort({ createdAt: -1 });

//     return res.json(grounds);
//   } catch (error) {
//     console.error("GET PENDING GROUNDS ERROR:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// /* ================= APPROVE GROUND ================= */
// export const approveGround = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const ground = await Ground.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           status: "approved",
//           approvedAt: new Date(),
//         },
//       },
//       { new: true }
//     );

//     if (!ground) {
//       return res.status(404).json({ message: "Ground not found" });
//     }

//     return res.json({
//       success: true,
//       message: "Ground approved successfully",
//       ground,
//     });
//   } catch (error) {
//     console.error("APPROVE GROUND ERROR:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// /* ================= REJECT GROUND ================= */
// export const rejectGround = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const ground = await Ground.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           status: "rejected",
//           rejectedAt: new Date(),
//         },
//       },
//       { new: true }
//     );

//     if (!ground) {
//       return res.status(404).json({ message: "Ground not found" });
//     }

//     return res.json({
//       success: true,
//       message: "Ground rejected successfully",
//       ground,
//     });
//   } catch (error) {
//     console.error("REJECT GROUND ERROR:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };




import Ground from "../models/Ground.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import {
  groundApprovedEmail,
  groundRejectedEmail,
} from "../utils/emailTemplate.js";

const getUserId = (req) => req.user?._id || req.user?.id;

/* ================= CREATE GROUND ================= */
export const createGround = async (req, res) => {
  try {
    const {
      name,
      location,
      latitude,
      longitude,
      phone,
      pricePerHour,
      images,
    } = req.body;

    const ownerId = getUserId(req);

    if (!ownerId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (
      !name?.trim() ||
      !location?.trim() ||
      latitude === undefined ||
      longitude === undefined ||
      pricePerHour === undefined
    ) {
      return res.status(400).json({
        message:
          "Please fill all required fields including latitude and longitude",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const price = Number(pricePerHour);

    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      return res
        .status(400)
        .json({ message: "Latitude must be between -90 and 90" });
    }

    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      return res
        .status(400)
        .json({ message: "Longitude must be between -180 and 180" });
    }

    if (Number.isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number" });
    }

    const ground = await Ground.create({
      name: name.trim(),
      location: location.trim(),
      latitude: lat,
      longitude: lng,
      phone: phone?.trim() || "",
      pricePerHour: price,
      images: Array.isArray(images) ? images : [],
      ownerId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Ground submitted for admin approval",
      ground,
    });
  } catch (error) {
    console.error("CREATE GROUND ERROR:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to create ground" });
  }
};

/* ================= GET ALL GROUNDS (PUBLIC) ================= */
export const getAllGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find({ status: "approved" }).sort({
      createdAt: -1,
    });

    return res.json(grounds);
  } catch (error) {
    console.error("GET ALL GROUNDS ERROR:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch grounds" });
  }
};

/* ================= GET ONE GROUND ================= */
export const getGroundById = async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    return res.json(ground);
  } catch (error) {
    console.error("GET GROUND BY ID ERROR:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch ground" });
  }
};

/* ================= GET MY GROUNDS (OWNER) ================= */
export const getMyGrounds = async (req, res) => {
  try {
    const ownerId = getUserId(req);

    if (!ownerId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const grounds = await Ground.find({ ownerId }).sort({
      createdAt: -1,
    });

    return res.json(grounds);
  } catch (error) {
    console.error("GET MY GROUNDS ERROR:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch your grounds" });
  }
};

/* ================= UPDATE GROUND (OWNER) ================= */
export const updateGround = async (req, res) => {
  try {
    const {
      name,
      location,
      latitude,
      longitude,
      phone,
      pricePerHour,
      images,
    } = req.body;

    const ownerId = getUserId(req);

    if (!ownerId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    if (String(ground.ownerId) !== String(ownerId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (name !== undefined) ground.name = name.trim();
    if (location !== undefined) ground.location = location.trim();

    if (latitude !== undefined) {
      const lat = Number(latitude);
      if (Number.isNaN(lat) || lat < -90 || lat > 90) {
        return res
          .status(400)
          .json({ message: "Latitude must be between -90 and 90" });
      }
      ground.latitude = lat;
    }

    if (longitude !== undefined) {
      const lng = Number(longitude);
      if (Number.isNaN(lng) || lng < -180 || lng > 180) {
        return res
          .status(400)
          .json({ message: "Longitude must be between -180 and 180" });
      }
      ground.longitude = lng;
    }

    if (phone !== undefined) ground.phone = phone.trim();

    if (pricePerHour !== undefined) {
      const price = Number(pricePerHour);
      if (Number.isNaN(price) || price <= 0) {
        return res
          .status(400)
          .json({ message: "Price must be a valid positive number" });
      }
      ground.pricePerHour = price;
    }

    if (images !== undefined) {
      ground.images = Array.isArray(images) ? images : [];
    }

    ground.status = "pending";

    const updatedGround = await ground.save();

    return res.json({
      message: "Ground updated and sent for re-approval",
      ground: updatedGround,
    });
  } catch (error) {
    console.error("UPDATE GROUND ERROR:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to update ground" });
  }
};

/* ================= DELETE GROUND (OWNER) ================= */
export const deleteGround = async (req, res) => {
  try {
    const ownerId = getUserId(req);

    if (!ownerId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    if (String(ground.ownerId) !== String(ownerId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await ground.deleteOne();

    return res.json({ message: "Ground removed" });
  } catch (error) {
    console.error("DELETE GROUND ERROR:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete ground" });
  }
};

/* ================= ADMIN LIST GROUNDS ================= */
export const getAdminGrounds = async (req, res) => {
  try {
    const status = req.query.status?.toLowerCase();
    const filter = {};

    if (status) filter.status = status;

    const grounds = await Ground.find(filter)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    const formatted = grounds.map((ground) => ({
      _id: ground._id,
      name: ground.name,
      location: ground.location,
      latitude: ground.latitude,
      longitude: ground.longitude,
      phone: ground.phone,
      pricePerHour: ground.pricePerHour,
      images: Array.isArray(ground.images) ? ground.images : [],
      status: ground.status || "pending",
      createdAt: ground.createdAt,
      approvedAt: ground.approvedAt || null,
      rejectedAt: ground.rejectedAt || null,
      ownerName: ground.ownerId?.name || "Unknown",
      ownerEmail: ground.ownerId?.email || "—",
      ownerId: ground.ownerId || null,
    }));

    return res.json({ grounds: formatted });
  } catch (error) {
    console.error("GET ADMIN GROUNDS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch admin grounds" });
  }
};

/* ================= GET PENDING GROUNDS ================= */
export const getPendingGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find({ status: "pending" })
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    return res.json(grounds);
  } catch (error) {
    console.error("GET PENDING GROUNDS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= APPROVE GROUND ================= */
export const approveGround = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("APPROVE GROUND START:", id);

    const ground = await Ground.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "approved",
          approvedAt: new Date(),
          rejectedAt: null,
        },
      },
      { new: true }
    );

    if (!ground) {
      console.log("APPROVE GROUND: NOT FOUND");
      return res.status(404).json({ message: "Ground not found" });
    }

    const owner = await User.findById(ground.ownerId).select("name email");
    console.log("APPROVE GROUND OWNER:", owner?.email);

    if (owner?.email) {
      await sendEmail({
        to: owner.email,
        subject: "Your Ground Has Been Approved on CricBook",
        html: groundApprovedEmail({
          ownerName: owner.name,
          groundName: ground.name,
          location: ground.location,
          pricePerHour: ground.pricePerHour,
        }),
      });
      console.log("APPROVE EMAIL SENT");
    } else {
      console.log("APPROVE EMAIL SKIPPED: owner email missing");
    }

    return res.json({
      success: true,
      message: "Ground approved successfully",
      ground,
    });
  } catch (error) {
    console.error("APPROVE GROUND ERROR:", error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

/* ================= REJECT GROUND ================= */
export const rejectGround = async (req, res) => {
  try {
    const { id } = req.params;
    const reason =
      req.body?.reason?.trim() ||
      "Please review your ground details and submit again.";

    console.log("REJECT GROUND START:", id);
    console.log("REJECT GROUND REASON:", reason);

    const ground = await Ground.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "rejected",
          rejectedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!ground) {
      console.log("REJECT GROUND: NOT FOUND");
      return res.status(404).json({ message: "Ground not found" });
    }

    const owner = await User.findById(ground.ownerId).select("name email");
    console.log("REJECT GROUND OWNER:", owner?.email);

    if (owner?.email) {
      await sendEmail({
        to: owner.email,
        subject: "Your Ground Submission Was Rejected on CricBook",
        html: groundRejectedEmail({
          ownerName: owner.name,
          groundName: ground.name,
          location: ground.location,
          rejectionReason: reason,
        }),
      });
      console.log("REJECT EMAIL SENT");
    } else {
      console.log("REJECT EMAIL SKIPPED: owner email missing");
    }

    return res.json({
      success: true,
      message: "Ground rejected successfully",
      ground,
    });
  } catch (error) {
    console.error("REJECT GROUND ERROR:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};