import User from "../models/User.js";

export const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    const updated = await User.findById(req.user._id).select("-password");
    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
