# USM-React (University Student Management)

## Project Overview & Architecture
USM-React is a modern University Student Management system designed to handle student data, courses, and administrative tasks efficiently. 
The architecture follows a standard client-server model:
- **Frontend**: A React-based web application providing an intuitive user interface for students and administrators.
- **Backend**: A Node.js and Express server handling API requests, business logic, and database operations.
- **Database**: MongoDB for scalable data storage.

## Prerequisites & Tech Stack
Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (v14 or higher)
- **MongoDB** (running locally or via MongoDB Atlas)

### Tech Stack
- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, Mongoose, JWT for authentication
- **Database**: MongoDB

## Environment Variables Setup
The backend requires certain environment variables to run successfully.
1. Navigate to the `Backend` directory.
2. You will find a `.env.example` file.
3. Create a `.env` file in the `Backend` directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your actual secrets (e.g., `MONGO_URI`, `JWT_SECRET`). Do not commit your real `.env` file to version control.

## Installation & Local Run Commands

### 1. Clone the repository
```bash
git clone <repository-url>
cd USM-React
```

### 2. Backend Setup
```bash
cd Backend
npm install
npm run dev
```
The backend server should start on port `5000` (or the port defined in your `.env`).

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd Frontend
npm install
npm start
```
The React application should start and be accessible at `http://localhost:3000`.
