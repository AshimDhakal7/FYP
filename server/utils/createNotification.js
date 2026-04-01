import Notification from "../models/Notification.js";

export const createNotification = async ({
  recipient,
  recipientRole,
  type = "general",
  title,
  message,
  link = "",
  data = {},
}) => {
  try {
    await Notification.create({
      recipient,
      recipientRole,
      type,
      title,
      message,
      link,
      data,
    });
  } catch (error) {
    console.error("CREATE NOTIFICATION ERROR:", error);
  }
};