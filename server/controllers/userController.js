// import User from "../models/User.js";

// export const updateMe = async (req, res) => {
//   try {

//     // get logged in user id from middleware
//     const userId = req.user?.id || req.user?._id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized user" });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // update fields
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.phone = req.body.phone || req.body.contactnumber || user.phone;  
//       // handle uploaded image
//     if (req.file) {
//       user.profilePicture = `/uploads/${req.file.filename}`;
//     }

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       phone: updatedUser.phone,
//       role: updatedUser.role,
//       profilePicture: updatedUser.profilePicture,
//     });

//   } catch (error) {
//     console.error("Profile update error:", error);
//     res.status(500).json({
//       message: "Server error while updating profile"
//     });
//   }
// };
import User from "../models/User.js";

export const updateMe = async (req, res) => {
  try {
    // Get logged-in user id from auth middleware
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only provided fields
    if (req.body.name !== undefined) {
      const name = String(req.body.name || "").trim();
      if (name) user.name = name;
    }

    if (req.body.email !== undefined) {
      const email = String(req.body.email || "").trim().toLowerCase();
      if (email) user.email = email;
    }

    if (req.body.phone !== undefined || req.body.contactnumber !== undefined) {
      user.phone = String(req.body.phone || req.body.contactnumber || "").trim();
    }

    // Supports Cloudinary/image URL sent from frontend
    if (req.body.profilePicture !== undefined) {
      user.profilePicture = String(req.body.profilePicture || "").trim();
    }

    // Supports multer/local uploaded image
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    return res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture || "",
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    if (error?.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};