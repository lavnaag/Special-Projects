# Pacific Access Control Portal

A mock enterprise portal that lets you control which internal data sources each AI agent is allowed to access.

Built with FastAPI (Python) and React (TypeScript).

---

## Prerequisites

- Python 3.9+
- Node.js 18+

---

## Running Locally

Clone the repo, then open two terminals.

### Terminal 1 — Backend

```bash
cd "Access Portal/pacific-access-portal/backend"
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`.

### Terminal 2 — Frontend

```bash
cd "Access Portal/pacific-access-portal/frontend"
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## What It Does

- Select an agent from the sidebar (Onboarding, Sales, Support, Engineering)
- Toggle which internal sources (Confluence, Slack, Salesforce, etc.) that agent can access
- Hit **Save changes** to persist the configuration

No auth required — Pacific's platform handles authentication separately.
