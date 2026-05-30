# ChefGPT

An AI-powered cooking assistant built with the MERN stack (Express.js, MongoDB, React + Vite) and Google Gemini API.

## Features

- User authentication (signup/login/profile)
- AI chat with Gemini for recipes, cooking tips, and meal planning
- Chat history management (create, read, update, delete)
- Markdown rendering for AI responses
- Dark/light theme toggle
- Responsive design (mobile + desktop)

## Prerequisites

- Node.js
- MongoDB (running locally on port 27017)
- A Google Gemini API key

## Setup

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env` with:

```
MONGODB_URI=mongodb://localhost:27017/chefgpt
PORT=3000
FRONTEND_URL=http://localhost:5173
SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the app

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
ChefGPT-Project/
├── backend/          # Express.js API server
│   ├── controllers/  # Auth & chat logic
│   ├── models/       # MongoDB schemas (User, Chat)
│   ├── routes/       # API route definitions
│   ├── middleware/    # JWT auth middleware
│   └── config/       # Database connection
├── frontend/         # React + Vite SPA
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, ChatWindow, etc.
│   │   ├── pages/        # Home, Login, Signup
│   │   ├── hooks/        # Custom React hooks
│   │   └── context/      # Auth context
│   └── public/       # Static assets
```

## API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | /api/user/signup      | Create account       |
| POST   | /api/user/login       | Login                |
| PATCH  | /api/user/profile     | Update profile       |
| GET    | /api/chats            | Get user's chats     |
| POST   | /api/chats            | Create new chat      |
| GET    | /api/chats/:id        | Get single chat      |
| DELETE | /api/chats/:id        | Delete chat          |
| POST   | /api/chats/:id/message| Send message to AI   |

## Tech Stack

- **Backend:** Express.js, Mongoose, JWT, bcrypt, Google Gemini API
- **Frontend:** React 19, Vite, react-router-dom, react-markdown
- **Database:** MongoDB
