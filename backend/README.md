# BuildSync Backend API

Backend server for BuildSync - A modern project management and collaboration platform.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **WebSocket** - Real-time communication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 👥 **Workspace Management** - Multi-user workspaces with member roles
- 📋 **Project Management** - Create and manage projects with status tracking
- ✅ **Task Management** - Assign tasks, add comments, and attachments
- 🔔 **Real-time Notifications** - WebSocket-based notification system
- 💬 **Chat System** - Workspace-level messaging
- 📁 **File Uploads** - Support for avatars and task attachments
- 🛡️ **Security** - Helmet, CORS, rate limiting, input validation

## Getting Started

### Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (if running locally):

```bash
mongod
```

4. Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Workspaces

- `GET /api/workspaces` - Get all workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/:id` - Get workspace by ID
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace
- `POST /api/workspaces/:id/members` - Add member
- `DELETE /api/workspaces/:id/members/:userId` - Remove member

### Projects

- `GET /api/projects?workspace=workspaceId` - Get projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Archive project
- `POST /api/projects/:id/members` - Add project member
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks

- `GET /api/tasks?project=projectId` - Get tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment
- `POST /api/tasks/:id/attachments` - Add attachment

### Notifications

- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread/count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/read-all` - Delete all read

### Chat

- `GET /api/chat/:workspaceId` - Get messages
- `POST /api/chat/:workspaceId` - Send message
- `PUT /api/chat/:workspaceId/:messageId` - Update message
- `DELETE /api/chat/:workspaceId/:messageId` - Delete message
- `PUT /api/chat/:workspaceId/:messageId/read` - Mark as read

### Members

- `GET /api/members/search?q=query` - Search users
- `GET /api/members/workspace/:workspaceId` - Get workspace members
- `GET /api/members/project/:projectId` - Get project members
- `PUT /api/members/workspace/:workspaceId/:userId` - Update member role

### Upload

- `POST /api/upload/avatar` - Upload avatar
- `POST /api/upload/attachment` - Upload attachment
- `POST /api/upload/attachments` - Upload multiple attachments
- `DELETE /api/upload/:type/:filename` - Delete file

## WebSocket

Connect to WebSocket for real-time updates:

```javascript
const ws = new WebSocket("ws://localhost:5000/ws?token=YOUR_JWT_TOKEN");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
};
```

### WebSocket Events

- `connection` - Connection established
- `notification` - New notification
- `new_message` - New chat message
- `message_updated` - Message edited
- `message_deleted` - Message deleted

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB configuration
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   ├── workspace.controller.js
│   │   ├── project.controller.js
│   │   ├── task.controller.js
│   │   ├── notification.controller.js
│   │   ├── chat.controller.js
│   │   ├── member.controller.js
│   │   └── upload.controller.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   ├── notFound.js          # 404 handler
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Workspace.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Notification.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── workspace.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   ├── notification.routes.js
│   │   ├── chat.routes.js
│   │   ├── member.routes.js
│   │   └── upload.routes.js
│   ├── websocket/
│   │   └── websocket.js         # WebSocket server
│   └── server.js                # Express app entry point
├── uploads/                     # File uploads directory
│   ├── avatars/
│   └── attachments/
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Security Features

- **Helmet** - Sets security HTTP headers
- **CORS** - Cross-Origin Resource Sharing protection
- **Rate Limiting** - Prevents brute force attacks
- **JWT** - Secure token-based authentication
- **Bcrypt** - Password hashing with salt
- **Input Validation** - Express-validator for request validation
- **MongoDB Injection Protection** - Mongoose sanitization

## Environment Variables

See `.env.example` for all available configuration options.

## Development

Run in development mode with auto-reload:

```bash
npm run dev
```

## Production

Build and run in production:

```bash
npm start
```

## Testing

```bash
npm test
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
