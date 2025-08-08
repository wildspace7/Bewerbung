# Bewerbung – ATS Cover Letter Generator

Dieses Projekt erstellt automatisch Bewerbungsanschreiben, die auf eine Stellenausschreibung zugeschnitten sind, und optimiert sie für Applicant Tracking Systeme (ATS).

## Start (lokal)

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload

### Frontend

```bash
cd frontend
npm i
npm run dev
