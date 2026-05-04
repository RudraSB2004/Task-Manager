# 🚀 Team Task Manager (MERN + Redux)

A full-stack **team collaboration and project management application** that allows users to create projects, assign tasks, and track progress with role-based access control.

This project simulates real-world tools like **Jira, Trello, and Asana**, focusing on scalable architecture, clean UI, and efficient state management.

---

## ✨ Features

### 🔐 Authentication

- User Signup & Login
- Secure JWT-based authentication
- Password hashing using bcrypt

### 👥 Role-Based Access Control (RBAC)

- Admin and Member roles
- Admin can create projects and assign tasks
- Members can update task status

### 📁 Project Management

- Create and manage multiple projects
- Add members to projects
- Project-specific task tracking

### ✅ Task Management

- Create, assign, and update tasks
- Status tracking:
  - Todo
  - In Progress
  - Done
- Deadlines support

### 📊 Dashboard & Analytics

- Project overview
- Weekly task activity (charts)
- Visual insights using Recharts

### 🎯 Kanban Board

- Task grouping by status
- Clean and intuitive UI

---

## 🏗️ Tech Stack

### Frontend

- React (Vite)
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Recharts
- Framer Motion
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

---

---

## 🌐 API Endpoints

### 🔐 Auth Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`

### 📁 Project Routes

- `GET /api/projects`
- `POST /api/projects`

### ✅ Task Routes

- `GET /api/tasks/:projectId`
- `POST /api/tasks`
- `PUT /api/tasks/:id`

---

## 🧠 Key Concepts Implemented

- REST API design
- JWT-based authentication
- Role-Based Access Control (RBAC)
- MongoDB schema relationships
- Redux global state management
- Component-based UI architecture
- Secure password hashing

---

## 📊 Dashboard Highlights

- Weekly activity bar chart
- Project overview cards
- Quick navigation to project boards

---

## 🔮 Future Enhancements

- Drag & Drop Kanban (using @hello-pangea/dnd)
- Real-time updates (Socket.io)
- Task comments and discussions
- File uploads & attachments
- Notifications system
- Activity logs
- Admin analytics panel

---

## 🧑‍💻 Author

**Rudra Shankar Biswas**

---

## ⭐ Support

If you like this project:

- Give it a ⭐ on GitHub
- Fork it and build your own features
- Use it as a base for advanced full-stack apps

---
