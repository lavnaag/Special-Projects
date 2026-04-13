const BASE = "http://localhost:8000";

export interface Source {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  allowed_sources: string[];
}

export async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch(`${BASE}/agents`);
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
}

export async function fetchSources(): Promise<Source[]> {
  const res = await fetch(`${BASE}/sources`);
  if (!res.ok) throw new Error("Failed to fetch sources");
  return res.json();
}

export async function updatePermissions(
  agentId: string,
  allowedSources: string[]
): Promise<Agent> {
  const res = await fetch(`${BASE}/agents/${agentId}/permissions`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ allowed_sources: allowedSources }),
  });
  if (!res.ok) throw new Error("Failed to update permissions");
  return res.json();
}
