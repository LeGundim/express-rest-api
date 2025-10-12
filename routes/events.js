import express from 'express';
import * as events from '../controllers/events.js';
import { authenticateToken } from '../util/auth.js';
import upload from '../util/upload.js';


// Initialize router
const router = express.Router();

// POST /events - Create a new event for user
router.post('/event', authenticateToken, upload.single('image'), events.create);

// GET /events - Get all user events
router.get('/events', authenticateToken, events.user_events);

// GET /events/:id - Get a single event for user by ID
router.get('/events/:id', authenticateToken, events.event);

// PUT /events/:id - Edit an event for user
router.put('/events/:id', authenticateToken, upload.single('image'), events.edit);

// DELETE /events/:id - Delete an event for user
router.delete('/events/:id', authenticateToken, events.deleteEvent);

// POST /events/:id/register - Register for an event
router.post('/events/:id/register', authenticateToken, events.register);

// DELETE /events/:id/unregister - Unregister for an event
router.delete('/events/:id/unregister', authenticateToken, events.unregister);

// Export router
export default router;
