import { generateToken } from '../util/auth.js';
import { AuthenticateUser, User, FindUserByEmail } from '../models/User.js';
import * as Events from '../models/Events.js';


// Controller functions for user signup
export async function signup(req, res) {
  const { name, email, password } = req.body;

  // Validate name, email, and password
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  // Validate password format
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@&!#_]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Invalid password format' });
  }

  // Convert email to lowercase and check if user already exists
  const lowercaseEmail = email.toLowerCase();
  const existingUser = FindUserByEmail(lowercaseEmail);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  } else {
    try {
      // Create user in database
      const user = await User({ name, email: lowercaseEmail, password });
      const token = generateToken(user.id, user.email);
      res.status(201).json({ message: 'User registered successfully', user: { name: user.name, email: user.email }, access_token: token });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Controller functions for user login
export async function login(req, res) {  
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password format
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@&!#_]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Invalid password format' });
  }

  // Convert email to lowercase
  const lowercaseEmail = email.toLowerCase();

  try {
    // Authenticate user
    const user = await AuthenticateUser(lowercaseEmail, password);

    // Check if user exists and password is correct
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    } else {
      // Login successful
      const token = generateToken(user.id, user.email);
      res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email }, access_token: token });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller functions for fetching events created by all users
export async function events(req, res) {
  try {
    const events = await Events.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
