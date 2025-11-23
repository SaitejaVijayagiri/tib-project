# Deployment Guide for TIB (Task & Idea Board)

Since I cannot directly deploy to a cloud provider for you, here is a guide on how to deploy this application yourself. The most common and easiest way to deploy a PERN (PostgreSQL, Express, React, Node) stack is using **Render** or **Heroku** for the backend/database and **Vercel** or **Netlify** for the frontend.

## Option 1: Deploying to Render (Easiest for Full Stack)

Render offers free hosting for Node.js web services and PostgreSQL databases.

### 1. Prepare your code
1.  Create a `render.yaml` file in your root directory (optional, but helps).
2.  Ensure your `package.json` in `backend` has a `start` script: `"start": "node server.js"`.
3.  Ensure your `package.json` in `frontend` has a `build` script.

### 2. Push to GitHub
1.  Initialize a git repository if you haven't: `git init`.
2.  Commit your code: `git add .` and `git commit -m "Ready for deploy"`.
3.  Push to a new GitHub repository.

### 3. Create PostgreSQL Database on Render
1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** -> **PostgreSQL**.
3.  Name it `tib-db`.
4.  Copy the **Internal DB URL** (for backend) and **External DB URL** (for local testing).

### 4. Deploy Backend Web Service
1.  Click **New +** -> **Web Service**.
2.  Connect your GitHub repo.
3.  **Root Directory**: `backend`.
4.  **Build Command**: `npm install`.
5.  **Start Command**: `npm start`.
6.  **Environment Variables**:
    *   `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`: Use details from the database you just created.
    *   `JWT_SECRET`: Set a secure random string.
    *   `PORT`: `10000` (Render default).

### 5. Deploy Frontend (Static Site)
1.  Click **New +** -> **Static Site**.
2.  Connect your GitHub repo.
3.  **Root Directory**: `frontend`.
4.  **Build Command**: `npm run build`.
5.  **Publish Directory**: `dist`.
6.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://tib-backend.onrender.com`).
    *   *Note: You'll need to update your frontend `api.js` to use this variable instead of `localhost`.*

## Option 2: Local Production Build (Simulated Deployment)

If you just want to run the "production" version locally:

1.  **Build Frontend**:
    ```bash
    cd frontend
    npm run build
    ```
2.  **Serve Static Files from Backend**:
    *   Modify `server.js` to serve the `frontend/dist` folder.
3.  **Run Backend**:
    ```bash
    cd backend
    npm start
    ```
    *   The app will be available at `http://localhost:5000`.

## Important Changes Needed for Deployment

Before deploying, you **must** update `frontend/src/services/api.js` to point to your production backend URL, not `localhost:5000`.

```javascript
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL });
```
