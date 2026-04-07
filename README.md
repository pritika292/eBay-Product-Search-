# Airbnb Search Assignment

This repository contains a React + TypeScript frontend and a FastAPI backend for an Airbnb-style search experience using dummy eBay-style listing data.

## Structure

- `frontend/` - React + TypeScript + Vite app
- `backend/` - FastAPI app
- `project-execution-checklist.txt` - planning notes and implementation checklist

## Current POC

The current proof of concept fetches dummy listing data from `GET /api/search` and renders the JSON payload in the React app.

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

## Verify

1. Start the backend.
2. Start the frontend.
3. Open `http://127.0.0.1:5173`.
4. Confirm the page shows a JSON block containing dummy listing items returned from `/api/search`.
