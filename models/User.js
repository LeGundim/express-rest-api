import db from '../db.js';
import bcrypt from 'bcryptjs';


// hashing salt rounds
const saltRounds = 10;
// Model function for user registration
export async function User(userData) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // Create user in database
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(userData.name, userData.email, hashedPassword);
    return {
      id: result.lastInsertRowid,
      ...userData,
      password: undefined // Don't return password
    };
  } catch (error) {
    throw new Error('Failed to create user: ' + error.message);
  }
};

// Model function for user lookup
export function FindUserByEmail(email) {
  try {
    const stmt = db.prepare('SELECT id, name, email, created_at FROM users WHERE email = ?');
    return stmt.get(email);
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

// Model function for user authentication
export async function AuthenticateUser(email, password) {
  try {
    const stmt = db.prepare('SELECT password FROM users WHERE email = ?');
    const user = stmt.get(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? FindUserByEmail(email) : null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};
