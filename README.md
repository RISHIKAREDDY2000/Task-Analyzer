# Task Analyzer (Express + Angular)

A simple full-stack app that demonstrates login with role-based access (Editor/Reader) and a text analysis endpoint.  
Backend is **Node.js (Express)** with a mock `data.json` “DB”. Frontend is **Angular** (standalone) with a minimal UI for login and analyze.

---

## ✨ Features
- **Login** (`/api/login`) with mock JWT + role in response  
- **RBAC** middleware (Editor vs Reader)  
- **Analyze** (`/api/analyze`) endpoint that returns a mock summary for provided text  
- **Angular** frontend with Login page and Analyzer page  
- **Proxy** setup to call backend from Angular dev server  
- Simple, testable structure and developer-friendly scripts

---

## 🚀 Quick Start
### Backend
```bash
cd backend
npm install
npm run dev

