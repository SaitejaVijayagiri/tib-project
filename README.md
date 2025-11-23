# TIB - Task & Idea Board

A simplified Trello clone built with React + Vite and Node.js + Express + PostgreSQL.

## Features
- User Signup/Login
- Create Boards
- Drag and Drop Cards
- Reorder Cards (within column and between columns)
- PostgreSQL Transactional Reordering

## Tech Stack
- **Frontend**: React, Vite, Axios, react-dnd, react-router-dom
- **Backend**: Node.js, Express, Sequelize, PostgreSQL
- **Database**: PostgreSQL

## Setup

### Prerequisites
- Node.js
- PostgreSQL running locally

### Backend Setup
1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` file if needed (default: `postgres://postgres:password@localhost:5432/tib_db`).
4. Start the server:
   ```bash
   npm start
   ```
   The server runs on `http://localhost:5000`.

### Frontend Setup
1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:5173`.

## Usage
1. Open `http://localhost:5173`.
2. Sign up for an account.
3. Create a new board.
4. Add cards to columns.
5. Drag and drop cards to reorder them.
