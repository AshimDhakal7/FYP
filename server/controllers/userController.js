import User from "../models/User.js";

export const updateMe = async (req, res) => {
  try {

    // get logged in user id from middleware
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    // handle uploaded image
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.json(updatedUser);

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Server error while updating profile"
    });
  }
};