# Event Management REST API

A robust RESTful API for managing events, built with Node.js and Express.js. This backend provides endpoints for user authentication, event creation, management, and user registrations for events.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Event Management**: Create, read, update, and delete events
- **User Registration**: Users can register for events
- **Image Uploads**: Support for uploading event images
- **Validation**: Input validation using express-validator
- **Database**: SQLite database for data persistence

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken), bcryptjs for password hashing
- **File Uploads**: Multer
- **Validation**: express-validator
- **CORS**: cors middleware
- **Environment**: dotenv for configuration

## 📄 Package.json

The `package.json` file is the heart of any Node.js project. It contains metadata about the project, including:

- **Project Information**: Name, version, description, author, and license details.
- **Dependencies**: Lists all the npm packages required for the project to run, such as:
  - `express`: Web framework for Node.js
  - `better-sqlite3`: SQLite database driver
  - `bcryptjs`: Password hashing utility
  - `jsonwebtoken`: JWT token generation and verification
  - `multer`: Middleware for handling file uploads
  - `express-validator`: Input validation middleware
  - `cors`: Cross-origin resource sharing middleware
  - `dotenv`: Environment variable management
- **Scripts**: Defines npm scripts for common tasks, e.g., `"dev"`: `"node --watch app.js"` to start the development server with auto-reload on file changes.

Note: This file is gitignored in the repository, so it won't be included in version control. To recreate it, run `npm init` and install the dependencies listed above.

## 📦 Managing Dependencies

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd express-rest-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

   This will install all required packages including:
   - express
   - better-sqlite3
   - bcryptjs
   - jsonwebtoken
   - multer
   - express-validator
   - cors
   - dotenv

## 🏗️ Building the App

The application is written in JavaScript and does not require a build step. All source files are ready to run.

However, ensure the database is initialized by running the server, which automatically creates the necessary tables.

## 🚀 Running the Server

1. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   PORT=3000
   JWT_SECRET=your_secret_key_here
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

   The server will start on the specified port (default: 3000) and initialize the database automatically.

## 📚 API Endpoints

### Authentication
- `POST /users/signup` - User registration
- `POST /users/login` - User login

### Events
- `GET /users/events` - Get all events (Note: Route might be under /user as per app.js)
- Additional event routes (check routes/events.js if implemented)

### Static Files
- `/images/*` - Serve uploaded images from public/images

## 🗄️ Database Schema

- **Users**: id, name, email, password, created_at
- **Events**: id, title, description, address, date, image, created_by, created_at
- **Registrations**: id, event_id, user_id, created_at

## 🔧 Configuration

- Environment variables are loaded from `.env` file
- Database file: `database.db`
- Uploaded images: `public/images/`

## 📝 License

This project is licensed under the Apache 2.0 License.
