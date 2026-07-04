# IGNITO Techfest Website

This is the frontend and local backend for the **IGNITO Techfest** website. 
It uses Vite, React, Tailwind CSS v4, and an Express.js backend for user authentication and event registration.

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine (v18+ recommended).

## Step-by-Step Setup

1. **Install Dependencies**
   Open a terminal in the project directory and run:
   ```bash
   npm install
   ```

2. **Start the Backend API Server**
   The backend handles user accounts and saves registration data. In your terminal, run:
   ```bash
   npm run server
   ```
   *You should see `🚀 IGNITO API running on http://localhost:3001`.*

3. **Start the Frontend Development Server**
   Leave the backend running. **Open a new (second) terminal window** in the exact same project directory and run:
   ```bash
   npm run dev
   ```
   *You should see a message indicating the Vite server is running, usually on `http://localhost:5173`.*

4. **View the Website**
   Open your browser and navigate to the URL provided by Vite (e.g., [http://localhost:5173](http://localhost:5173)).

## Troubleshooting

- **"Failed to fetch" on registration?** Make sure you have the backend running in a separate terminal (`npm run server`).
- **T-minus loader loops endlessly?** Make sure your `vite.config.js` is ignoring the `server/` directory so Vite doesn't reload the page every time the database saves.

## Important Notes for Production (e.g., Vercel)

If you deploy the frontend to a static host like Vercel, the `localhost:3001` backend will **not** work for public users. They will get a security prompt about accessing local network devices because their browser is trying to find the API on their own computer.

To make it work in production:
1. Deploy the `server` folder to a service that supports persistent Node.js servers (like **Render**, **Railway**, or **Fly.io**).
2. Open `src/lib/api.js` and change the `BASE` variable from `http://localhost:3001/api` to your newly deployed backend URL.
3. Redeploy your frontend to Vercel so it points to the live API.
