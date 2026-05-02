# Expense Tracker Frontend

A simple React app to view and add expenses. Connects to your backend at `http://localhost:3000/expenses`.

## Getting Started

1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```
2. Create environment file:
   ```powershell
   copy .env.example .env
   ```
   Fill the Auth0 values in `.env`:
   - `REACT_APP_AUTH0_DOMAIN`
   - `REACT_APP_AUTH0_CLIENT_ID`
   - `REACT_APP_AUTH0_AUDIENCE`
3. Start the app:
   ```powershell
   npm start
   ```
4. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Features
- View all expenses
- Add a new expense
- See total amount

## Backend
Make sure your NestJS backend is running on `localhost:3000`.

## Auth0 app settings checklist
In your Auth0 Application settings, include:
- Allowed Callback URLs: `http://localhost:3001`
- Allowed Logout URLs: `http://localhost:3001`
- Allowed Web Origins: `http://localhost:3001`

If these are missing or your domain/client ID is wrong, Auth0 can show an "Access denied" page.

## Netlify (Frontend-only) deployment
This app now supports frontend-only mode using `localStorage` (no backend/database needed).

1. Push your repo to GitHub.
2. In Netlify, import the repo and set:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
3. Add environment variable:
   - `REACT_APP_DISABLE_AUTH=true`
4. Deploy.

Your transactions and current money are saved per browser in `localStorage`.
