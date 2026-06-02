# CricBook – A web-based Indoor cricket booking system

## Project Overview
CricBook is a MERN stack-based sports ground booking web application developed to simplify the process of booking sports grounds online. The system allows users to register, browse available grounds, check slot availability, book grounds, make payments, and receive notifications. Ground owners and administrators can manage bookings through dedicated dashboards.

## Features
- User Registration and Login
- OTP Email Verification
- Role-Based Access (User, Owner, Admin)
- Sports Ground Listing and Management
- Ground Slot Availability Checking
- Online Ground Booking
- Payment Integration
- Booking Notifications
- Booking History
- Owner Dashboard
- Admin Panel
- JWT Authentication

## Technologies Used

### Frontend
- React.js
- Vite
- Axios
- React Router DOM
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js
- Nodemailer
- Multer
- Morgan

## Database
MongoDB is used as the NoSQL database to store user information, bookings, grounds, notifications, and payment-related data.

## Project Structure

CricBook/
│── client/          # Frontend (React)
│── server/          # Backend (Node.js & Express)
│── package.json
│── README.md

## Installation
### Frontend Setup
bash
cd client
npm install
npm run dev 

### Backend Setup
bash
cd server
npm install
npm run dev