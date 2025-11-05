# BuildSync - Full Stack Project Management Platform

## Project Overview

BuildSync is a modern, full-stack project management and collaboration platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides real-time collaboration features, task management, team communication, and comprehensive project tracking.

## Architecture

### Frontend

- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with dark mode support
- **State Management:** React Context API (Auth, Theme, Workspace, Notifications)
- **Routing:** React Router v6
- **Real-time:** WebSocket integration for live updates
- **Optimization:** Code splitting with React.lazy, memoization with React.memo

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time:** WebSocket (ws) for bidirectional communication
- **File Upload:** Multer for handling multipart/form-data
- **Security:** Helmet, CORS, Rate Limiting, Bcrypt password hashing
- **Validation:** Express-validator

## Key Features

### ✅ Completed Features

#### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Role-based access control (Admin, User)
- Password hashing with bcrypt
- Profile management
- Password change functionality

#### Workspace Management

- Create and manage workspaces
- Multi-user workspaces with member roles (Owner, Admin, Member)
- Add/remove workspace members
- Update member roles
- Workspace settings (visibility, invites)

#### Project Management

- Create projects within workspaces
- Project status tracking (Planning, Active, On-hold, Completed, Archived)
- Priority levels (Low, Medium, High, Urgent)
- Start and due dates
- Project members with roles
- Tags and color coding
- Progress calculation based on task completion

#### Task Management

- Create and assign tasks
- Task status workflow (Todo, In Progress, Review, Completed, Blocked)
- Priority assignment
- Due dates
- Comments on tasks
- File attachments
- Task assignment notifications

#### Real-time Notifications

- WebSocket-based notification system
- Notification types: task_assigned, task_updated, comment_added, mention, etc.
- Mark as read/unread
- Bulk mark all as read
- Delete notifications
- Unread count tracking

#### Chat System

- Workspace-level messaging
- Real-time message delivery via WebSocket
- Message editing and deletion
- Read receipts
- File attachments in messages

#### File Management

- Avatar uploads for users
- Task attachment uploads
- Support for multiple file types
- File size limits (10MB)
- Secure file storage

#### Member Management

- User search for invitations
- Workspace member listing
- Project member listing
- Role updates

#### UI/UX Features

- 🌓 Dark mode with system preference detection
- 📱 Responsive design (mobile, tablet, desktop)
- ⌨️ Keyboard shortcuts (Cmd/Ctrl+K for search, Shift+? for help)
- 🎯 Onboarding tour for new users
- 🔍 Global search functionality
- 📊 Activity feed with filtering
- 💀 Skeleton loaders for better UX
- ⚡ Performance optimizations (lazy loading, memoization)

## Project Structure

```
BuildSync/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/             # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── workspace.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── task.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── member.controller.js
│   │   │   └── upload.controller.js
│   │   ├── middleware/              # Request middleware
│   │   │   ├── auth.js             # JWT authentication
│   │   │   ├── errorHandler.js     # Error handling
│   │   │   ├── notFound.js         # 404 handler
│   │   │   ├── rateLimiter.js      # Rate limiting
│   │   │   └── validation.js       # Input validation
│   │   ├── models/                  # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Workspace.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── Notification.js
│   │   │   └── Message.js
│   │   ├── routes/                  # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── workspace.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── task.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── member.routes.js
│   │   │   └── upload.routes.js
│   │   ├── scripts/
│   │   │   └── seed.js             # Database seeding
│   │   ├── websocket/
│   │   │   └── websocket.js        # WebSocket server
│   │   └── server.js               # Express app
│   ├── uploads/                     # File storage
│   ├── .env                         # Environment variables
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── assets/                  # Static assets
│   │   ├── components/              # React components
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── member/
│   │   │   ├── notification/
│   │   │   ├── project/
│   │   │   ├── task/
│   │   │   └── workspace/
│   │   ├── config/
│   │   │   └── api.config.js       # API configuration
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── WorkspaceContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── hooks/                   # Custom hooks
│   │   ├── pages/                   # Page components
│   │   ├── routes/                  # Routing
│   │   ├── services/                # API services
│   │   ├── styles/                  # CSS files
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
│
├── QUICKSTART.md                    # Quick start guide
└── README.md                        # This file
```

## API Endpoints

### Authentication (`/api/auth`)

- POST `/register` - Register new user
- POST `/login` - Login user
- GET `/me` - Get current user
- PUT `/profile` - Update profile
- PUT `/change-password` - Change password
- POST `/logout` - Logout

### Workspaces (`/api/workspaces`)

- GET `/` - Get all workspaces
- POST `/` - Create workspace
- GET `/:id` - Get workspace by ID
- PUT `/:id` - Update workspace
- DELETE `/:id` - Delete workspace
- POST `/:id/members` - Add member
- DELETE `/:id/members/:userId` - Remove member

### Projects (`/api/projects`)

- GET `/` - Get projects (query: workspace, status, priority)
- POST `/` - Create project
- GET `/:id` - Get project by ID
- PUT `/:id` - Update project
- DELETE `/:id` - Archive project
- POST `/:id/members` - Add member
- DELETE `/:id/members/:userId` - Remove member

### Tasks (`/api/tasks`)

- GET `/` - Get tasks (query: project, workspace, status, priority)
- POST `/` - Create task
- GET `/:id` - Get task by ID
- PUT `/:id` - Update task
- DELETE `/:id` - Delete task
- POST `/:id/comments` - Add comment
- POST `/:id/attachments` - Add attachment

### Notifications (`/api/notifications`)

- GET `/` - Get all notifications
- GET `/unread/count` - Get unread count
- PUT `/:id/read` - Mark as read
- PUT `/read-all` - Mark all as read
- DELETE `/:id` - Delete notification
- DELETE `/read-all` - Delete all read

### Chat (`/api/chat`)

- GET `/:workspaceId` - Get messages
- POST `/:workspaceId` - Send message
- PUT `/:workspaceId/:messageId` - Update message
- DELETE `/:workspaceId/:messageId` - Delete message
- PUT `/:workspaceId/:messageId/read` - Mark as read

### Members (`/api/members`)

- GET `/search` - Search users
- GET `/workspace/:workspaceId` - Get workspace members
- GET `/project/:projectId` - Get project members
- PUT `/workspace/:workspaceId/:userId` - Update member role

### Upload (`/api/upload`)

- POST `/avatar` - Upload avatar
- POST `/attachment` - Upload attachment
- POST `/attachments` - Upload multiple attachments
- DELETE `/:type/:filename` - Delete file

## Database Schema

### User

- name, email, password (hashed)
- avatar, role (user/admin)
- isActive, lastLogin
- timestamps

### Workspace

- name, description
- owner (User ref)
- members array (user, role, joinedAt)
- settings (visibility, allowInvites)
- isActive

### Project

- name, description
- workspace (ref), owner (ref)
- status, priority
- startDate, dueDate
- members array (user, role, joinedAt)
- tags, color
- isArchived

### Task

- title, description
- project (ref), workspace (ref)
- assignedTo (ref), createdBy (ref)
- status, priority
- dueDate, completedAt
- tags
- attachments array
- comments array (nested)

### Notification

- recipient (ref), sender (ref)
- type (enum)
- title, message, link
- metadata (workspace/project/task IDs)
- read, readAt

### Message

- workspace (ref)
- sender (ref)
- content, type
- attachments array
- isEdited, editedAt
- isDeleted, deletedAt
- readBy array

## Security Features

- **Authentication:** JWT tokens with configurable expiration
- **Password Security:** Bcrypt hashing with salt rounds
- **HTTP Security:** Helmet.js for security headers
- **CORS:** Configured for frontend origin
- **Rate Limiting:** Prevent brute force attacks
- **Input Validation:** Express-validator for all inputs
- **XSS Protection:** Mongoose sanitization
- **File Upload Security:** Type and size restrictions

## Technologies Used

### Backend

- Node.js 16+
- Express.js 4.18
- MongoDB 5+
- Mongoose 8.0
- JWT (jsonwebtoken 9.0)
- bcryptjs 2.4
- WebSocket (ws 8.14)
- Multer 1.4
- Helmet 7.1
- Express-validator 7.0
- Compression 1.7
- Morgan (logging)

### Frontend

- React 18.3
- Vite 6.0
- React Router 7.1
- Tailwind CSS 3.4
- Axios 1.7
- Lucide React (icons)

## Development Setup

See `QUICKSTART.md` for detailed setup instructions.

### Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x

### Quick Commands

```bash
# Backend
cd backend
npm install
npm run dev          # Start development server
npm run seed         # Seed database with demo data

# Frontend
cd frontend
npm install
npm run dev          # Start development server
```

### Optional: Cloud realtime via Pusher

You can switch realtime delivery from the built-in WebSocket server to a managed provider (Pusher) with minimal config.

1. Backend environment variables (e.g., `backend/.env`):

```
PUSHER_APP_ID=your-app-id
PUSHER_KEY=your-key
PUSHER_SECRET=your-secret
PUSHER_CLUSTER=your-cluster
```

2. Frontend environment variables (e.g., `frontend/.env`):

```
VITE_REALTIME_PROVIDER=pusher
VITE_PUSHER_KEY=your-key
VITE_PUSHER_CLUSTER=your-cluster
```

When configured, the app will publish chat and notification events to:

- private-user-{userId}: direct messages and notifications
- presence-workspace-{workspaceId}: workspace chat messages

The backend exposes `POST /api/realtime/pusher/auth` to securely sign channel subscriptions.
If the Pusher environment vars are not set, the app continues using the built-in WebSocket server.

## Demo Credentials

After running `npm run seed` in backend:

- **Admin:** admin@buildsync.com / password123
- **User 1:** john@example.com / password123
- **User 2:** jane@example.com / password123
- **User 3:** mike@example.com / password123

## Future Enhancements

### Testing Suite (Planned)

- Unit tests with Jest
- Integration tests for API endpoints
- End-to-end tests with Cypress
- Component tests with React Testing Library

### Additional Features (Ideas)

- Email notifications
- Calendar view for tasks
- Gantt chart for project timeline
- Time tracking
- Reports and analytics
- File version control
- Advanced permissions
- API webhooks
- Mobile app (React Native)
- Desktop app (Electron)

## Performance Optimizations

- Code splitting with React.lazy
- Component memoization with React.memo
- Image lazy loading
- Database indexing on frequently queried fields
- Response compression (gzip)
- WebSocket for real-time updates (no polling)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

## Support

For issues and questions:

- Check `QUICKSTART.md` for setup help
- Review `backend/README.md` for API documentation
- Review `frontend/README.md` for frontend documentation

---

**Built with ❤️ using the MERN Stack**
