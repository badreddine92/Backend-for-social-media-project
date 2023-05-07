const user = require('../models/user')

const createNotifications = async (receiverId, type, recipeId = null, senderId = null, commentId = null) => {
    try {
      const receiver = await user.findById(receiverId);
      if (!receiver) throw new Error('User not found');
      const sender = await user.findById(senderId);
      if(!sender) throw new Error('Follower does not exist')
  
      let notificationBody = '';
  
      switch (type) {
        case 'follow':
          notificationBody = `${sender.username} followed you`;
          break;
        case 'like':
          notificationBody = `${sender.username} liked your post`;
          break;
        case 'comment':
          notificationBody = `${sender.username} commented on your post`;
          break;
        case 'share':
          notificationBody = `${sender.username} shared your post`;
          break;
        default:
          notificationBody = 'New notification';
      }
  
      const notification = { type, body: notificationBody };
      if (recipeId) notification.recipeId = recipeId;
      if (senderId) notification.senderId = senderId;
      if (commentId) notification.commentId = commentId;
  
      receiver.notifications.push(JSON.stringify(notification));
      await receiver.save();

      return notification;

    } catch (err) {
      throw new Error(`Error creating notification: ${err.message}`);
    }
  };
  
  module.exports = {
    createNotifications
  };