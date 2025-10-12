import db from './db.js';


// Create database tables if they don't exist
export function initializeDatabase() {
  const createTable = (tableName, columns) => {
    const columnDefinitions = columns.map(({ name, type, constraints }) =>
      `${name} ${type} ${constraints || ''}`
    ).join(', ');
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});`;
    db.exec(sql);
  };
  try {
    // Create columns for users table
    const usersColumns = [
      { name: 'id', type: 'INTEGER PRIMARY KEY' },
      { name: 'name', type: 'TEXT NOT NULL' },
      { name: 'email', type: 'TEXT UNIQUE NOT NULL' },
      { name: 'password', type: 'TEXT NOT NULL' },
      { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    ];
    // Create users table
    createTable('users', usersColumns);
    // Create columns for events table
    const eventsColumns = [
      { name: 'id', type: 'INTEGER PRIMARY KEY' },
      { name: 'title', type: 'TEXT NOT NULL' },
      { name: 'description', type: 'TEXT' },
      { name: 'address', type: 'TEXT' },
      { name: 'date', type: 'DATETIME NOT NULL' },
      { name: 'image', type: 'TEXT' }, // Add image column
      { name: 'created_by', type: 'INTEGER NOT NULL', constraints: 'REFERENCES users (id)' },
      { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    ];
    // Create events table
    createTable('events', eventsColumns);
    // Create columns for registrations table
    const registrationsColumns = [
      { name: 'id', type: 'INTEGER PRIMARY KEY' },
      { name: 'event_id', type: 'INTEGER NOT NULL', constraints: 'REFERENCES events (id)' },
      { name: 'user_id', type: 'INTEGER NOT NULL', constraints: 'REFERENCES users (id)' },
      { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    ];
    // Create registrations table
    createTable('registrations', registrationsColumns);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit with error code
  }
};
