# eBay Product Search

This repository contains a React + TypeScript frontend and a FastAPI backend for an eBay product search experience with an Airbnb-inspired results interface.

## Live Demo

- Frontend: https://ebay-products.onrender.com
- Backend API: https://ebay-search-service.onrender.com/search

## Structure

- `frontend/` - React + TypeScript + Vite app
- `backend/` - FastAPI app

## Current POC

The current proof of concept fetches mock listing data from `GET /search?q=` and renders it in an Airbnb-inspired results UI with search, sorting, and incremental loading. The backend currently owns the listing contract, including `condition`, so the frontend only renders API data.

## Runtime Requirements

- Node.js 20+
- Python 3.11+

## Run Locally

### Backend

```bash
cd backend
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --reload
```

The backend will run on `http://127.0.0.1:8000`.

To lint the backend:

```bash
cd backend
.venv/bin/ruff check app tests
```

To run the backend tests:

```bash
cd backend
.venv/bin/pytest
```

To check backend test coverage:

```bash
cd backend
.venv/bin/pytest --cov=app --cov-report=term-missing
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://127.0.0.1:5173`.

Vite is configured to proxy `/search`, `/api/*`, and `/health` requests to the FastAPI backend during local development.

If you prefer env-based local configuration, copy the example files and adjust as needed:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

## Verify

1. Start the backend.
2. Start the frontend.
3. Open `http://127.0.0.1:5173`.
4. Confirm the page shows listing cards returned from `/search`.

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
- `EBAY_CLIENT_ID=`
- `EBAY_CLIENT_SECRET=`

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

## Tradeoffs

- The current backend uses curated mock data instead of the live eBay Browse API so the UI, validation, and deployment flow could be completed end to end first.
- Pagination is implemented client-facing as incremental page fetches against the mock dataset, which keeps the behavior aligned with how the real API integration should work.
- The backend exposes both `/search` and `/api/search` right now. `/search?q=` is the primary public contract and `/api/search` is kept temporarily for compatibility with the existing internal API prefix.

## Next Steps

- Replace the mock listing source with an eBay Browse API client and adapter layer.
- Add eBay-specific health checks and upstream failure handling.
- Expand tests around the future eBay integration boundary, including upstream error scenarios and contract mapping.
