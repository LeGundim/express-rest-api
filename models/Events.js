import db from '../db.js';


// Function to create a new event
export async function createEvent(eventData) {
  try {
    const stmt = db.prepare('INSERT INTO events (title, description, address, date, image, created_by) VALUES (?, ?, ?, ?, ?, ?)');
    const result = stmt.run(eventData.title, eventData.description, eventData.address, eventData.date, eventData.image, eventData.created_by);
    return {
      id: result.lastInsertRowid,
      ...eventData,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    throw new Error('Failed to create event: ' + error.message);
  }
};

// Function to edit an event
export async function editEvent(id, eventData) {
  try {
    const stmt = db.prepare('UPDATE events SET title = ?, description = ?, address = ?, date = ?, image = ? WHERE id = ?');
    const result = stmt.run(eventData.title, eventData.description, eventData.address, eventData.date, eventData.image, id);
    if (result.changes === 0) {
      throw new Error('Event not found');
    }
    return { id, ...eventData };
  } catch (error) {
    throw new Error('Failed to edit event: ' + error.message);
  }
};

// Function to delete an event
export async function deleteUserEvent(id) {
  try {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      throw new Error('Event not found');
    }
    return { message: 'Event deleted successfully' };
  } catch (error) {
    throw new Error('Failed to delete event: ' + error.message);
  }
};

// Function to get all events
export async function getAllEvents() {
  try {
    const stmt = db.prepare('SELECT id, title, description, address, date, image, created_by, created_at FROM events');
    return stmt.all();
  } catch (error) {
    throw new Error('Failed to get events: ' + error.message);
  }
};

// Function to get all events for a specific user
export async function getEventsByUser(userId) {
  try {
    const stmt = db.prepare('SELECT id, title, description, address, date, image, created_by, created_at FROM events WHERE created_by = ?');
    return stmt.all(userId);
  } catch (error) {
    throw new Error('Failed to get events: ' + error.message);
  }
};

// Function to get a single user event by id for a specific parameter
// Second parameter is the column name we want to match against (e.g. id, title, etc.)
// Third parameter is the value of the column we want to match against
export async function getEventByUserAndParameter(userId, parameter, value) {
  try {
    const stmt = db.prepare('SELECT id, title, description, address, date, image, created_by, created_at FROM events WHERE ' + parameter + ' = ? AND created_by = ?');
    const event = stmt.get(value, userId);
    if (!event && parameter === 'id') {
      throw new Error('Event not found');
    }
    return event;
  } catch (error) {
    throw new Error('Failed to get event: ' + error.message);
  }
};

// Function to register for an event
export async function registerForEvent(id, userId) {
  try {
    // Check if user has already registered for event
    const checkStmt = db.prepare('SELECT * FROM registrations WHERE event_id = ? AND user_id = ?');
    const existing = checkStmt.get(id, userId);
    if (existing) {
      throw new Error('User has already registered for event');
    }
    // Register for event
    const stmt = db.prepare('INSERT INTO registrations (event_id, user_id) VALUES (?, ?)');
    const result = stmt.run(id, userId);
    if (result.changes === 0) {
      throw new Error('Event not found');
    }
    return { message: 'Event registered successfully' };
  } catch (error) {
    throw new Error('Failed to register for event: ' + error.message);
  }
};

// Function to unregister for an event
export async function unregisterForEvent(id, userId) {
  try {
    const stmt = db.prepare('DELETE FROM registrations WHERE event_id = ? AND user_id = ?');
    const result = stmt.run(id, userId);
    if (result.changes === 0) {
      throw new Error('Event not found');
    }
    return { message: 'Event unregistered successfully' };
  } catch (error) {
    throw new Error('Failed to unregister for event: ' + error.message);
  }
};
