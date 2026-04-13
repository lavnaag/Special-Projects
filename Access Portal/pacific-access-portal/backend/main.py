from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import copy

app = FastAPI(title="Pacific Access Control Portal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Mock data
# ---------------------------------------------------------------------------

SOURCES = [
    {"id": "confluence", "name": "Confluence", "description": "Internal wiki and documentation", "category": "Knowledge"},
    {"id": "slack",      "name": "Slack",      "description": "Team messaging and channels",     "category": "Communication"},
    {"id": "salesforce", "name": "Salesforce", "description": "CRM and customer records",        "category": "CRM"},
    {"id": "gdrive",     "name": "Google Drive","description": "Shared documents and spreadsheets","category": "Storage"},
    {"id": "jira",       "name": "Jira",       "description": "Project and issue tracking",      "category": "Project Mgmt"},
    {"id": "github",     "name": "GitHub",     "description": "Source code repositories",        "category": "Engineering"},
    {"id": "notion",     "name": "Notion",     "description": "Notes, wikis, and databases",     "category": "Knowledge"},
    {"id": "zendesk",    "name": "Zendesk",    "description": "Customer support tickets",        "category": "Support"},
]

AGENTS = [
    {
        "id": "agent-onboarding",
        "name": "Onboarding Assistant",
        "description": "Guides new employees through setup and first-day tasks",
        "allowed_sources": ["confluence", "gdrive", "notion"],
    },
    {
        "id": "agent-sales",
        "name": "Sales Copilot",
        "description": "Assists account executives with deal context and customer history",
        "allowed_sources": ["salesforce", "slack", "gdrive"],
    },
    {
        "id": "agent-support",
        "name": "Support Agent",
        "description": "Handles tier-1 customer inquiries and escalations",
        "allowed_sources": ["zendesk", "confluence", "slack"],
    },
    {
        "id": "agent-eng",
        "name": "Engineering Assistant",
        "description": "Answers technical questions and reviews pull requests",
        "allowed_sources": ["github", "jira", "confluence"],
    },
]

# In-memory store (keyed by agent id → set of allowed source ids)
_permissions: dict[str, set[str]] = {
    a["id"]: set(a["allowed_sources"]) for a in AGENTS
}


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class PermissionUpdate(BaseModel):
    allowed_sources: List[str]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/agents")
def list_agents():
    result = []
    for a in AGENTS:
        agent = copy.copy(a)
        agent["allowed_sources"] = list(_permissions[a["id"]])
        result.append(agent)
    return result


@app.get("/agents/{agent_id}")
def get_agent(agent_id: str):
    agent = next((a for a in AGENTS if a["id"] == agent_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    result = copy.copy(agent)
    result["allowed_sources"] = list(_permissions[agent_id])
    return result


@app.get("/sources")
def list_sources():
    return SOURCES


@app.put("/agents/{agent_id}/permissions")
def update_permissions(agent_id: str, body: PermissionUpdate):
    if agent_id not in _permissions:
        raise HTTPException(status_code=404, detail="Agent not found")
    valid_ids = {s["id"] for s in SOURCES}
    invalid = [s for s in body.allowed_sources if s not in valid_ids]
    if invalid:
        raise HTTPException(status_code=400, detail=f"Unknown source(s): {invalid}")
    _permissions[agent_id] = set(body.allowed_sources)
    return {"agent_id": agent_id, "allowed_sources": list(_permissions[agent_id])}
