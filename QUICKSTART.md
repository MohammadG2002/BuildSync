# BuildSync - Quick Start Guide

## Prerequisites

Before you start, ensure you have the following installed:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v5 or higher) - [Download here](https://www.mongodb.com/try/download/community)
3. **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Start MongoDB

**Option A: MongoDB as a Service (Windows)**

```powershell
# If installed as a service, start MongoDB
net start MongoDB
```

**Option B: MongoDB Manual Start**

```powershell
# Navigate to MongoDB bin directory
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start MongoDB
mongod --dbpath "C:\data\db"
```

**Option C: MongoDB Cloud (Atlas)**

- Use MongoDB Atlas (cloud database)
- Update `MONGODB_URI` in `.env` with your Atlas connection string

### 2. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# Create .env file (already created, verify settings)
# Edit .env if needed for your environment

# Start the development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Seed Database (Optional)

To populate the database with demo data:

```powershell
npm run seed
```

This will create:

- 4 demo users
- 1 demo workspace
- 2 demo projects
- 3 demo tasks

**Demo Login Credentials:**

- Email: `admin@buildsync.com` | Password: `password123`
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`

### 4. Frontend Setup

Open a new terminal:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is in use)

## Verify Everything is Working

1. **Backend Health Check:**

   - Open: `http://localhost:5000/health`
   - Should see: `{"status":"ok","message":"Server is running"}`

2. **Frontend:**

   - Open: `http://localhost:5173`
   - You should see the BuildSync landing page

3. **WebSocket:**
   - WebSocket server runs on the same port as the backend (5000)
   - Path: `ws://localhost:5000/ws`

## Common Issues

### MongoDB Connection Error

```
Error connecting to MongoDB: connect ECONNREFUSED
```

**Solution:** Make sure MongoDB is running. See "Start MongoDB" section above.

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Another process is using port 5000. Either:

- Stop the other process
- Change `PORT` in backend `.env` file

### Missing Dependencies

```
Error: Cannot find module 'express'
```

**Solution:** Run `npm install` in the backend directory.

## Development Workflow

### Backend Changes

- Changes are auto-reloaded with nodemon
- Check terminal for any errors

### Frontend Changes

- Vite hot module replacement (HMR) auto-updates the browser
- Check browser console for errors

### API Testing

Use tools like:

- **Postman** - [Download](https://www.postman.com/downloads/)
- **Thunder Client** (VS Code Extension)
- **cURL** (Command line)

Example cURL request:

```powershell
# Register a new user
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/buildsync
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (src/config/api.config.js)

- Already configured to use `http://localhost:5000`
- WebSocket: `ws://localhost:5000/ws`

## Next Steps

1. **Explore the App:**

   - Register a new account or use demo credentials
   - Create a workspace
   - Add projects and tasks
   - Try the real-time chat and notifications

2. **Read Documentation:**

   - Backend API: `backend/README.md`
   - Frontend: `frontend/README.md`

3. **Customize:**
   - Modify colors in `frontend/tailwind.config.js`
   - Add new features using the existing structure

## Production Deployment

See `backend/README.md` and `frontend/README.md` for production deployment guides.

## Need Help?

- Check the console/terminal for error messages
- Verify all services (MongoDB, Backend, Frontend) are running
- Ensure all environment variables are correctly set
- Check that ports 5000 and 5173 are available

## Technology Stack

**Backend:**

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- WebSocket (ws)
- Multer (File Uploads)

**Frontend:**

- React 18
- Vite
- Tailwind CSS
- React Router
- Context API

---

**Congratulations!** 🎉 Your BuildSync development environment is ready!
