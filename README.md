# Airbnb Search Assignment

This repository contains a React + TypeScript frontend and a FastAPI backend for an Airbnb-style search experience using dummy eBay-style listing data.

## Live Demo

- Frontend: https://ebay-products.onrender.com
- Backend API: https://ebay-search-service.onrender.com/api/search

## Structure

- `frontend/` - React + TypeScript + Vite app
- `backend/` - FastAPI app
- `project-execution-checklist.txt` - planning notes and implementation checklist

## Current POC

The current proof of concept fetches dummy listing data from `GET /api/search` and renders it in an Airbnb-inspired results UI with search, sort, and load-more behavior.

## Run Locally

### Backend

```bash
cd backend
.venv/bin/python -m uvicorn app.main:app --reload
```

The backend will run on `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://127.0.0.1:5173`.

Vite is configured to proxy `/api/*` requests to the FastAPI backend during local development.

If you prefer env-based local configuration, copy the example files and adjust as needed:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

## Verify

1. Start the backend.
2. Start the frontend.
3. Open `http://127.0.0.1:5173`.
4. Confirm the page shows dummy listing cards returned from `/api/search`.

## Deploy On Render

This repo is set up for a two-service Render deployment:

- Backend: Render Web Service
- Frontend: Render Static Site

### Backend service

Create a new Render `Web Service` with:

- Root Directory: `backend`
- Runtime: `Python`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Recommended environment variables:

- `PYTHON_VERSION=3.11.4`
- `CORS_ALLOWED_ORIGINS=https://<your-frontend>.onrender.com`

Your backend URL will look like:

```text
https://<your-backend>.onrender.com
```

### Frontend service

Create a new Render `Static Site` with:

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Required environment variable:

- `VITE_API_BASE_URL=https://<your-backend>.onrender.com`

### Important note

The local Vite proxy only works in development. In Render, the frontend uses `VITE_API_BASE_URL` to talk to the backend directly.
