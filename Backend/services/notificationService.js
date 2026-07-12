import Notification from '../models/Notification.js';

export const createNotification = async (userId, title, message, type = 'system') => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type
    });
    return notification;
  } catch (error) {
    console.error(`[Notification Service Error] Failed to create notification: ${error.message}`);
    // Do not crash the application if notification fails
    return null;
  }
};

export const getNotificationsByUser = async (userId) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
  if (!notification) {
    throw new Error('Notification not found');
  }
  return notification;
};

export const deleteNotification = async (notificationId, userId) => {
  const result = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  if (!result) {
    throw new Error('Notification not found');
  }
  return true;
};
