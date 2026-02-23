# ✈️ WanderMind — AI Travel Planner

A full-stack AI travel planner with authentication, PostgreSQL history, and profile editing.

## Tech Stack

| Layer    | Tech                                          |
| -------- | --------------------------------------------- |
| Frontend | React + Vite (no router lib, state-based nav) |
| Backend  | FastAPI + Uvicorn                             |
| AI Chain | LangChain + Gemini 1.5 Pro                    |
| Database | PostgreSQL + SQLAlchemy ORM                   |
| Auth     | JWT (python-jose) + bcrypt (passlib)          |

---

## Project Structure

```
travel-planner/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── core/
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   └── security.py          # JWT + bcrypt helpers
│   ├── models/
│   │   ├── user.py              # User ORM model
│   │   └── trip.py              # Trip ORM model
│   ├── schemas/
│   │   ├── user.py              # Pydantic schemas for auth/profile
│   │   └── trip.py              # Pydantic schemas for trips
│   └── routers/
│       ├── auth.py              # POST /auth/register, /auth/login
│       ├── users.py             # GET/PATCH /users/me
│       └── trips.py             # POST /trips/plan, GET /trips/history, DELETE /trips/{id}
└── frontend/
    └── src/
        ├── App.jsx              # Page router (state-based)
        ├── index.css
        ├── api/
        │   └── client.js        # Centralized fetch with JWT headers
        ├── context/
        │   └── AuthContext.jsx  # Global auth state + login/logout
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PlannerForm.jsx
        │   └── ItineraryView.jsx
        └── pages/
            ├── HomePage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── PlannerPage.jsx
            ├── HistoryPage.jsx
            └── ProfilePage.jsx
```

---

## Setup

### 1. PostgreSQL

Make sure PostgreSQL is running locally, then create a database:

```bash
psql -U postgres
CREATE DATABASE wandermind;
\q
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

touch .env
# Fill in your .env:
#   GOOGLE_API_KEY=...
#   DATABASE_URL=postgresql://postgres:password@localhost:5432/wandermind
#   SECRET_KEY=any-long-random-string

uvicorn main:app --reload
# API → http://localhost:8000
# Swagger → http://localhost:8000/docs
```

Tables are auto-created on first startup via SQLAlchemy `create_all`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## API Endpoints

| Method | Path           | Auth | Description               |
| ------ | -------------- | ---- | ------------------------- |
| POST   | /auth/register | ❌   | Create account            |
| POST   | /auth/login    | ❌   | Get JWT token             |
| GET    | /users/me      | ✅   | Get profile               |
| PATCH  | /users/me      | ✅   | Update name / bio         |
| POST   | /trips/plan    | ✅   | Generate + save itinerary |
| GET    | /trips/history | ✅   | List past trips           |
| GET    | /trips/{id}    | ✅   | Get full trip detail      |
| DELETE | /trips/{id}    | ✅   | Delete a trip             |

---

## Key Concepts Demonstrated

- **JWT Authentication** — stateless auth with `python-jose`, tokens stored in localStorage
- **Password hashing** — bcrypt via `passlib`
- **SQLAlchemy ORM** — relational models with foreign keys and cascading deletes
- **LangChain LCEL** — `prompt | llm | parser` pipeline with Pydantic output parsing
- **FastAPI dependency injection** — `get_db`, `get_current_user` as reusable deps
- **React Context API** — global auth state without Redux
- **Protected pages** — client-side redirect based on auth state
