# TaskPro Backend

TaskPro is a backend service developed for task and user management. The project is built with Node.js, Express.js, and MongoDB. It includes modern backend features such as JWT-based authentication, session management, file uploads, and theme support.

## Table of Contents

- [TaskPro Backend](#taskpro-backend)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Getting Started](#getting-started)
  - [Main Routes](#main-routes)
    - [Auth Routes (`/auth`)](#auth-routes-auth)
      - [`/auth/register`](#authregister)
      - [`/auth/login`](#authlogin)
      - [`/auth/refresh`](#authrefresh)
      - [`/auth/logout`](#authlogout)
    - [User Routes (`/users`)](#user-routes-users)
      - [`/users/` (GET)](#users-get)
      - [`/users/:userId` (GET)](#usersuserid-get)
      - [`/users/` (POST)](#users-post)
      - [`/users/:userId` (PATCH)](#usersuserid-patch)
      - [`/users/:userId` (DELETE)](#usersuserid-delete)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Session Management](#session-management)
  - [Swagger/OpenAPI Documentation](#swaggeropenapi-documentation)
  - [API Documentation (Redocly)](#api-documentation-redocly)
  - [Code Quality and Standards](#code-quality-and-standards)
  - [Contributing](#contributing)
  - [License](#license)

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/leventkoybasi/taskpro-backend.git
   cd taskpro-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env` and fill in the required fields.

## Environment Variables

The following environment variables are required:

- `PORT`
- `APP_DOMAIN`
- `MONGODB_USER`, `MONGODB_PASSWORD`, `MONGODB_URL`, `MONGODB_DB`
- `JWT_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

See `.env.example` for details.

## Getting Started

```bash
npm run dev
```

or

```bash
npm start
```

## Main Routes

### Auth Routes (`/auth`)

| Method | Route       | Description            |
| ------ | ----------- | ---------------------- |
| POST   | `/register` | Register a new user    |
| POST   | `/login`    | User login             |
| POST   | `/refresh`  | Refresh JWT token      |
| POST   | `/logout`   | Logout and end session |

#### `/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourPassword"
}
```

**Response:**

```json
{
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "theme": "light"
  },
  "accessToken": "jwt-access-token"
}
```

#### `/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "yourPassword"
}
```

**Response:**

```json
{
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "theme": "light"
  },
  "accessToken": "jwt-access-token"
}
```

#### `/auth/refresh`

**Request:**  
Refresh token and sessionId are sent via cookies.

**Response:**

```json
{
  "accessToken": "new-jwt-access-token"
}
```

#### `/auth/logout`

**Request:**  
Refresh token and sessionId are sent via cookies.

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

### User Routes (`/users`)

| Method | Route      | Description       |
| ------ | ---------- | ----------------- |
| GET    | `/`        | Get all users     |
| GET    | `/:userId` | Get user by ID    |
| POST   | `/`        | Create a new user |
| PATCH  | `/:userId` | Update user       |
| DELETE | `/:userId` | Delete user       |

#### `/users/` (GET)

**Response:**

```json
[
  {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "theme": "light"
  }
]
```

#### `/users/:userId` (GET)

**Response:**

```json
{
  "id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "theme": "light"
}
```

#### `/users/` (POST)

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourPassword"
}
```

**Response:**

```json
{
  "id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "theme": "light"
}
```

#### `/users/:userId` (PATCH)

**Request Body:**

```json
{
  "name": "Jane Doe",
  "theme": "dark"
}
```

**Response:**

```json
{
  "id": "userId",
  "name": "Jane Doe",
  "email": "john@example.com",
  "theme": "dark"
}
```

#### `/users/:userId` (DELETE)

**Response:**

```json
{
  "message": "User deleted"
}
```

## Authentication

- JWT-based authentication is used.
- Session records are kept with access and refresh tokens.
- For login and token refresh, refresh token and sessionId are sent via cookies.

## User Management

- Users are created with name, email, password, avatar, and theme.
- Passwords are hashed with bcrypt.
- Theme can be `light`, `dark`, or `violet`.

## Session Management

- On each login, old sessions are deleted and a new session is created.
- When the token expires, it can be refreshed via `/auth/refresh`.
- On logout, the session and cookies are cleared.

## Swagger/OpenAPI Documentation

- Swagger UI is available for API documentation.
- To generate documentation:
  ```bash
  npm run build-docs
  ```
- Then access via `/docs/swagger.json` or the relevant endpoint.

## API Documentation (Redocly)

To generate the OpenAPI documentation (`swagger.json`) using Redocly, run:

```bash
npm run build-docs
```

This will bundle your OpenAPI YAML file (`docs/openapi.yaml`) into a JSON file (`docs/swagger.json`).

To preview the documentation locally in your browser, run:

```bash
npm run preview-docs
```

## Code Quality and Standards

- The project uses ESLint for code standards.
- Code formatting rules are defined in `.prettierrc`.
- All code is written in modern ES6+ syntax.

## Contributing

Please fork the repository and submit a pull request. Run linter and tests before submitting your code.

## License

ISC

---
