import express from 'express';
import requireAuth from '../middlewares/requireAuth.mjs';
import Message from '../models/message.mjs';

const router = express.Router();

// Get all conversations for the user
router.get('/conversations', requireAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const conversations = await Message.aggregate([
      { $match: { $or: [ { sender: userId }, { recipient: userId } ] } },
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', userId] },
            '$recipient',
            '$sender'
          ]
        },
        lastMessage: { $first: '$$ROOT' }
      } },
      { $replaceRoot: { newRoot: '$lastMessage' } }
    ]);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages with a specific user
router.get('/with/:userId', requireAuth, async (req, res) => {
  const userId = req.user._id;
  const otherUserId = req.params.userId;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/', requireAuth, async (req, res) => {
  const sender = req.user._id;
  const { recipient, content, chatType } = req.body;
  try {
    const message = await Message.create({ sender, recipient, content, chatType });
    // TODO: Emit via Socket.io
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark messages as read
router.post('/read/:userId', requireAuth, async (req, res) => {
  const userId = req.user._id;
  const otherUserId = req.params.userId;
  try {
    await Message.updateMany({ sender: otherUserId, recipient: userId, read: false }, { $set: { read: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

export default router;