import * as Events from '../models/Events.js';
import fs from 'fs';
import path from 'path';


// Controller function for creating an event
export async function create(req, res) {
  try {
    const { title, description, address, date } = req.body;

    // Validate title and date input fields
    if (!title || !date || !title.trim() || isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'Title and date are required and must be valid.' });
    }
    // Validate description and address input fields
    if (!description || !address || !description.trim() || !address.trim()) {
      return res.status(400).json({ message: 'Description and address are required.' });
    }
    // Validate image input field if it exists and is valid image file type
    // Check if image type is valid (e.g. jpeg, png, jpg)
    if (req.file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Invalid image format.' });
      }
    }

    // Check if event with same title already exists
    const existingEvent = await Events.getEventByUserAndParameter(req.user.userId, 'title', title);
    if (existingEvent) {
      return res.status(409).json({ message: 'Event with same title already exists.' });
    }
    // Create event for user
    const eventData = {
      title,
      description,
      address,
      date,
      image: req.file ? req.file.filename : null,
      created_by: req.user.userId
    };
    const event = await Events.createEvent(eventData);
    // Return created event
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller function for editing an event
export async function edit(req, res) {
  try {
    const { id } = req.params;
    const { title, description, address, date } = req.body;

    // Validate title and date input fields
    if (!title || !date || !title.trim() || isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'Title and date are required and must be valid.' });
    }
    // Validate description and address input fields
    if (!description || !address || !description.trim() || !address.trim()) {
      return res.status(400).json({ message: 'Description and address are required.' });
    }
    // Validate image input field if it exists and is valid image file type
    // Check if image type is valid (e.g. jpeg, png, jpg)
    if (req.file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Invalid image format.' });
      }
    }

    // Check if event exists and belongs to user
    const existingEvent = await Events.getEventByUserAndParameter(req.user.userId, 'id', id);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    // Assign image to event data or keep old image if no new upload
    const eventData = {
      title,
      description,
      address,
      date,
      image: req.file ? req.file.filename : existingEvent.image // Keep old image if no new upload
    };
    // Edit event for user
    const updatedEvent = await Events.editEvent(id, eventData);
    // Return updated event
    res.status(200).json(updatedEvent);
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ message: error.message + '.' });
    } else {
      console.error('Error editing event:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

// Controller function for deleting an event
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    // Check if event exists and belongs to user
    const event = await Events.getEventByUserAndParameter(req.user.userId, 'id', id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    // Delete event for user
    await Events.deleteUserEvent(id);
    // Delete the specified image from ./public/images folder as well
    if (event.image) {
      const imagePath = path.join('./public/images', event.image);
      try {
        fs.unlinkSync(imagePath);
        // Log the deleted image path
        console.log(`Deleted image: ${imagePath}`);
      } catch (fileError) {
        // Log file deletion error but don't fail the event deletion
        console.error(`Failed to delete image file: ${imagePath}`, fileError.message);
        // Return 500 status if file deletion fails
        return res.status(500).json({
          message: 'Event deleted successfully, but failed to delete associated image file.',
          error: process.env.NODE_ENV === 'development' ? fileError.message : undefined
        });
      }
    }
    // Return no content if everything succeeded
    res.status(204).send();
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ message: error.message + '.' });
    } else {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

// Controller function for getting all events for a specific user
export async function user_events(req, res) {
  try {
    const events = await Events.getEventsByUser(req.user.userId);
    // Return all events for user
    res.status(200).json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller function for getting all events
export async function events(req, res) {
  try {
    const events = await Events.getAllEvents();
    // Return all events
    res.status(200).json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller function for getting a single event by ID
export async function event(req, res) {
  try {
    const { id } = req.params;
    // Check if event exists and belongs to authenticated user
    const event = await Events.getEventByUserAndParameter(req.user.userId, 'id', id);
    // Return an event by ID for user
    res.status(200).json(event);
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ message: error.message + '.' });
    } else {
      console.error('Error getting event:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

// Controller function for registering for an event
export async function register(req, res) {
  try {
    const { id } = req.params;
    // Check if event exists and belongs to user
    const event = await Events.getEventByUserAndParameter(req.user.userId, 'id', id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    // Register for event
    const result = await Events.registerForEvent(id, req.user.userId);
    // Return result with message body
    res.status(201).json(result);
  } catch (error) {
    if (error.message.includes('User has already registered for event')) {
      res.status(409).json({ message: error.message + '.' });
    } else if (error.message.includes('Event not found')) {
      res.status(404).json({ message: error.message + '.' });
    } else {
      console.error('Error registering for event:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

// Controller function for unregistering for an event
export async function unregister(req, res) {
  try {
    const { id } = req.params;
    // Check if event exists and belongs to user
    const event = await Events.getEventByUserAndParameter(req.user.userId, 'id', id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    // Unregister for event
    await Events.unregisterForEvent(id, req.user.userId);
    // Return no content
    res.status(204).send();
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ message: error.message + '.' });
    } else {
      console.error('Error unregistering for event:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};
