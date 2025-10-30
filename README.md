# Event Management REST API

A robust RESTful API for managing events, built with Node.js and Express.js. This backend provides endpoints for user authentication, event creation, management, and user registrations for events.

## 🔧 Development Setup

### Node.js Version Management with mise

This project includes a [.mise.toml](.mise.toml) configuration file for [mise](https://mise.jdx.dev/), a powerful runtime manager. To get started:

1. Install `mise` if you haven't already:
   ```bash
   curl -fsSL https://mise.jdx.dev/install.sh | sh
   ```

2. Install the correct Node.js version and set up your environment:
   ```bash
   mise install
   ```

3. The correct Node.js version will be used automatically when you're in the project directory.

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

## 📝 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## Author

👤 **Shubhojit Dasgupta**

- GitHub: [@Brisinger](https://github.com/Brisinger)
- Project Link: [https://github.com/Brisinger/express-rest-api](https://github.com/Brisinger/express-rest-api)

## 📦 Managing Dependencies

1. Clone the repository:
   ```bash
   git clone https://github.com/Brisinger/express-rest-api.git
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

## 🔧 Environment Configuration

The application uses environment variables for configuration management. These variables are loaded from a `.env` file in the root directory using the `dotenv` package.

### Setting up the .env file

1. Create a `.env` file in the root directory of the project:
   ```bash
   touch .env
   ```

2. Add the following environment variables to your `.env` file:

   ```env
   # Server Configuration
   HOST=localhost
   PORT=3000

   # Environment
   NODE_ENV=development

   # JWT Secret (REQUIRED - Generate using methods below)
   JWT_SECRET=your_generated_secret_here
   ```

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `HOST` | Host where the application will run | `localhost` | No |
| `PORT` | Port where the application will run | `3000` | No |
| `NODE_ENV` | Application environment (`development` or `production`) | `development` | No |
| `JWT_SECRET` | Secret key for JWT token signing and verification | None | **Yes** |

### Generating a Secure JWT Secret

The `JWT_SECRET` must be a cryptographically strong random string. Here are several secure methods to generate it:

#### Method 1: Using Node.js Crypto (Recommended)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Method 2: Using OpenSSL
```bash
openssl rand -hex 64
```

#### Method 3: Using /dev/urandom (Linux/macOS)
```bash
head -c 64 /dev/urandom | xxd -p -c 64
```

#### Method 4: Online Generator (Development Only)
For development purposes, you can use an online secret generator, but **never use this method for production** as it compromises security.

**Example generated secret:**
```
JWT_SECRET="0ab863ab944fb0e431fc0ccc73c683a40373b966c27323b761f60c4be379602e8aec4f0848de851a651da9797fd9ef6cfc32fccaf1fbd69c53ed93d6e5d89d8c"
```

### Security Best Practices

1. **Never commit .env files** - The `.env` file should be added to `.gitignore`
2. **Use strong secrets** - Generate JWT secrets with at least 256 bits (32 bytes) of entropy
3. **Rotate secrets regularly** - Change JWT secrets periodically in production
4. **Use different secrets per environment** - Development and production should have different secrets
5. **Restrict file permissions** - Set `.env` file permissions to `600` (owner read/write only)

### Running the Server

1. After setting up your `.env` file with all required variables, start the server:
   ```bash
   npm run dev
   ```

2. The server will start on the specified port and initialize the database automatically.

   The application will log the port it's running on (e.g., "Server is running on port 3000").

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

