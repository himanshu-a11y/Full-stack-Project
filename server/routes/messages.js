const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const JobApplication = require('../models/JobApplication');
const authGuard = require('../middleware/authGuard');
const mongoose = require('mongoose');

// GET /api/messages/unread-count
router.get('/unread-count', authGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Message.countDocuments({ receiverId: userId, isRead: false });
    return res.json({ count });
  } catch (err) {
    console.error('GET /api/messages/unread-count error:', err);
    return res.status(500).json({ message: 'Failed to fetch unread count' });
  }
});

// PATCH /api/messages/read/:otherUserId
router.patch('/read/:otherUserId', authGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;
    await Message.updateMany(
      { senderId: otherUserId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );
    return res.json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error('PATCH /api/messages/read/:otherUserId error:', err);
    return res.status(500).json({ message: 'Failed to mark messages as read' });
  }
});

// GET /api/messages — Fetch conversation between current user and another user
router.get('/:otherUserId', authGuard, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.otherUserId;

    console.log('GET /api/messages: currentUserId=', currentUserId, 'otherUserId=', otherUserId);

    if (!mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'Invalid user IDs' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    return res.json({ messages });
  } catch (err) {
    console.error('GET /api/messages/:otherUserId error:', err);
    return res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// POST /api/messages — Send a message
router.post('/', authGuard, async (req, res) => {
  try {
    const { receiverId, content, senderModel, receiverModel } = req.body;
    const senderId = req.user?.id;

    console.log('POST /api/messages: senderId=', senderId, 'receiverId=', receiverId);

    if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
      console.error('POST /api/messages: Missing or invalid senderId');
      return res.status(400).json({ message: 'Authentication error: user identity missing' });
    }

    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: 'Invalid receiver ID' });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      senderModel,
      receiverModel,
      content
    });

    return res.status(201).json({ message });
  } catch (err) {
    console.error('POST /api/messages error:', err);
    return res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
