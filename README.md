# IGNITO Techfest Website

This is the frontend and local backend for the **IGNITO Techfest** website. 
It features a space-themed dynamic UI built with React and Tailwind v4, backed by a lightweight, zero-configuration SQLite database via Express.js.

## 🚀 Features

- **Dynamic Theming:** The entire color scheme is controlled via a single file (`src/styles/theme.css`) using Tailwind CSS v4 `@theme` directives. No hardcoded hex values in the components.
- **Authentication:** Full user registration and login system. Passwords are securely hashed using `bcryptjs` and sessions are maintained via `JSON Web Tokens (JWT)`.
- **Event Registration:** Authenticated users can register for events and competitions. The UI dynamically updates to reflect registered states with visual feedback.
- **Zero-Config Database:** Uses `better-sqlite3` to auto-generate a local SQLite database (`server/ignito.db`) with Write-Ahead Logging (WAL) enabled for high performance.
- **Animated UI:** Includes Framer Motion for scroll reveals, hover states, and a dynamic HTML5 canvas starfield background that respects `prefers-reduced-motion` settings.

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React (Icons)
- **Backend:** Express.js (Node.js)
- **Database:** SQLite (`better-sqlite3`)
- **Security:** `bcryptjs` (Hashing), `jsonwebtoken` (Auth)

## 💻 Step-by-Step Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine (v18+ recommended).
*Note: Because the backend uses `better-sqlite3`, a native C++ build step might run during `npm install`. You may need Visual Studio Build Tools / Python installed if you are on Windows and don't have pre-built binaries available.*

### 1. Install Dependencies
Open a terminal in the project directory and run:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file by copying the provided example template:
```bash
cp .env.example .env
```
*(Optional: Open `.env` and configure your specific values if needed, such as changing the `JWT_SECRET`.)*

### 3. Start the Backend API Server
The backend handles user authentication and stores registration data in a local SQLite file (`server/ignito.db`). 
In your terminal, run:
```bash
npm run server
```
*You should see `🚀 IGNITO API running on port 3001`.*

### 4. Start the Frontend Development Server
Leave the backend running. **Open a new (second) terminal window** in the exact same project directory and run:
```bash
npm run dev
```
*You should see a message indicating the Vite server is running, usually on `http://localhost:5173`.*

### 5. View the Website
Open your browser and navigate to the URL provided by Vite (e.g., [http://localhost:5173](http://localhost:5173)).

---

## 🛟 Troubleshooting

- **"Failed to fetch" on registration?** Make sure you have the backend running in a separate terminal (`npm run server`).
- **Database errors or `better-sqlite3` failing to install?** Ensure your environment supports native Node.js addons (e.g., install `windows-build-tools` on Windows).
- **T-minus loader loops endlessly?** Ensure the `VITE_API_URL` inside your `.env` file correctly points to the running backend.

---

## 🚀 Important Notes for Production (e.g., Vercel)

If you deploy the frontend to a static host like Vercel, the `localhost:3001` backend will **not** work for public users. They will get a security prompt about accessing local network devices because their browser is trying to find the API on their own computer.

**To make it work in production:**
1. Deploy the `server` folder to a Node.js hosting provider (like **Render**, **Railway**, **Fly.io**, or an AWS EC2 instance) that supports persistent disk storage for the SQLite database.
2. In your Frontend Hosting Provider (e.g. Vercel), set the `VITE_API_URL` environment variable to point to your newly deployed backend URL (e.g., `https://api.my-ignito-backend.com/api`).
3. Set a strong, unique `JWT_SECRET` in your backend server's environment variables.
4. Redeploy your frontend so it correctly queries the live API.
