# Student Management System

A full-stack educational project using **HTML, CSS, JavaScript, Node.js, Express and SQLite**.

## Features
- Dashboard counts for total, active, inactive and graduated students
- Create, read, update and delete student records
- Search by student ID, name, email or course
- Filter by status
- Server-side validation and unique student ID/email checks
- Responsive interface
- SQLite database created automatically
- Basic security headers using Helmet

## Requirements
- Node.js 18 or newer
- npm

## Run locally
1. Extract this ZIP file.
2. Open a terminal inside `student-management-system`.
3. Run `npm install`.
4. Run `npm start`.
5. Open http://localhost:3000.

For development with automatic restart, use `npm run dev`.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/students` | List/search/filter students |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Add student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

Example JSON for POST/PUT:
```json
{
  "student_code": "STU-1001",
  "full_name": "Riya Sharma",
  "email": "riya@example.com",
  "phone": "9876543210",
  "course": "BCA",
  "enrollment_date": "2026-07-01",
  "status": "Active"
}
```

## Project structure
```text
student-management-system/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/
│   ├── db.js
│   └── server.js
├── .gitignore
├── package.json
└── README.md
```

## Publish to GitHub
Create a new GitHub repository named `student-management-system`. Then run these commands in the extracted project folder (replace YOUR-USERNAME):
```bash
git init
git add .
git commit -m "Initial Student Management System"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/student-management-system.git
git push -u origin main
```
Your repository address will then be `https://github.com/YOUR-USERNAME/student-management-system`.

## Important
This is a learning/demo starter, not a production-ready student information system. It does not include login or role-based access yet. Do not publish it with real student data until authentication, authorization, HTTPS, backups and privacy controls are implemented. The SQLite database is excluded from Git. Use fictional sample records for demonstrations.
