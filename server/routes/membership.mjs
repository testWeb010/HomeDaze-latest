import express from 'express';
import { cookieAuth, requireRole } from '../middlewares/cookieAuth.mjs';
import { Membership } from '../models/membership.mjs';

const router = express.Router();

// Get all memberships (admin only)
router.get('/', cookieAuth, requireRole(['admin']), async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get membership by user ID
router.get('/user/:userId', cookieAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the requesting user is the same as the requested user or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
    }
    
    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    res.json(membership);
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create or update membership
router.post('/update', cookieAuth, async (req, res) => {
  try {
    const { userId, planId, startDate } = req.body;
    
    // Check if the requesting user is the same as the requested user or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
    }
    
    const membership = await Membership.findOneAndUpdate(
      { userId },
      { planId, startDate, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ data: membership, message: 'Membership updated successfully' });
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel membership
router.post('/cancel/:userId', cookieAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the requesting user is the same as the requested user or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
    }
    
    const membership = await Membership.findOneAndUpdate(
      { userId },
      { status: 'cancelled', updatedAt: new Date(), endDate: new Date() },
      { new: true }
    );
    
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    
    res.json({ message: `Membership cancelled for user ${userId}` });
  } catch (error) {
    console.error('Error cancelling membership:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
