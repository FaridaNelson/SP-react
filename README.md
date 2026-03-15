# StudioPulse Frontend (SP-react)

StudioPulse is a modern web platform designed to help private music teachers manage students, track lesson progress, and organize exam preparation.

This repository contains the **React frontend application**.

🔗 Live Application  
https://studiopulse.co

🔗 Backend API  
https://api.studiopulse.co

---

# Overview

StudioPulse improves communication and organization between **teachers, students, and parents** by structuring lesson preparation and progress tracking.

The platform helps teachers:

- track student progress
- manage lesson materials
- prepare students for music exams
- keep parents informed about progress

---

## Screenshots

![Teacher Dashboard](screenshots/teacherDashboard-examCycle.png)

![Sign Up Form with Terms of Service and Privacy Policy](screenshots/registrationModal.png)

![Home Page](screenshots/homePage.png)

# Core Features

### Authentication

Secure signup and login using **JWT authentication via HTTP-only cookies**.

Supported roles:

- Teacher
- Parent
- Student
- Admin

---

### Teacher Dashboard

Teachers can:

- view their students
- create new students
- access detailed student profiles
- track lesson progress

---

### Student Information View

Displays:

- student information
- parent contact information
- teacher assignment
- exam preparation details

---

### Lesson Progress Tracking

Teachers can record progress for:

- Pieces (A–C)
- Scales
- Sight Reading
- Aural Training

Each lesson stores detailed performance metrics and notes.

---

### Score History

Progress history is stored and displayed for:

- exam preparation tracking
- long-term student development
- parent visibility

---

# Technology Stack

Frontend

- React
- Vite
- React Router
- CSS Modules
- Framer Motion

Backend (separate repository)

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

Backend Repository

https://github.com/FaridaNelson/SP-express

---

# Project Structure

src
├ components
├ pages
├ contexts
├ services
├ utils
└ assets

The frontend communicates with the backend through REST APIs exposed by **SP-express**.

---

# Local Development

Install dependencies:

npm install

Run development server:

npm run dev

Default development URL:

http://localhost:5173

The frontend expects the backend API running locally or at:

https://api.studiopulse.co

---

# Production Deployment

Frontend is served through **Nginx** on an Ubuntu VM.

Build application:

npm run build

Deploy build:

sudo rm -rf /var/www/studiopulse.co/_
sudo cp -r dist/_ /var/www/studiopulse.co/
sudo systemctl reload nginx

---

# Project Origin

StudioPulse was created to solve real workflow challenges in private music studios.

The platform is designed to reduce administrative overhead while giving teachers, students, and parents a clear view of musical progress.

---

# Contributors

**Farida Nelson**  
Full-Stack Development, Backend Architecture, API Design, System Integration, Product Logic

**Dilara Swain**  
UX/UI Design, User Experience Strategy, and User Workflow Design

StudioPulse combines software engineering and user-centered design to build a practical platform for music education.

---

# Author

Farida Nelson  
Software Engineer | Music Educator | Performer

Founder – Farida Nelson Music LLC  
Founder – Farida Nelson Digital Solutions LLC

LinkedIn  
https://linkedin.com/in/farida-nelson

Website  
https://studiopulse.co
