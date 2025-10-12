import express from 'express';
import { signup, login } from '../controllers/users.js';
import { events } from '../controllers/events.js';
import { body, validationResult } from 'express-validator';


// Initialize router
const router = express.Router();

// Validation middleware for signup
const signupValidation = [
  body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long').trim(),
  body('email').isEmail().withMessage('Invalid email format').trim(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').trim()
];

// Validation middleware for login
const loginValidation = [
  body('email').isEmail().withMessage('Invalid email format').trim(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').trim()
];

// Validation error handler
async function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /users/signup
router.post('/signup', signupValidation, handleValidationErrors, signup);
// POST /users/login
router.post('/login', loginValidation, handleValidationErrors, login);
// GET /users/events
router.get('/events', events);
// Export router
export default router;
