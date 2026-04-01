import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    return res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    return res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("MARK NOTIFICATION READ ERROR:", error);
    return res.status(500).json({ message: "Failed to update notification" });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("MARK ALL NOTIFICATIONS READ ERROR:", error);
    return res.status(500).json({ message: "Failed to update notifications" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error);
    return res.status(500).json({ message: "Failed to delete notification" });
  }
};