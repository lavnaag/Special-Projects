import { useEffect, useState } from "react";
import { Agent, Source, fetchAgents, fetchSources, updatePermissions } from "./api";
import { AgentSidebar } from "./components/AgentSidebar";
import { SourceGrid } from "./components/SourceGrid";
import "./index.css";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<Set<string>>(new Set());
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchAgents(), fetchSources()])
      .then(([a, s]) => {
        setAgents(a);
        setSources(s);
        if (a.length > 0) {
          setSelectedId(a[0].id);
          setEnabled(new Set(a[0].allowed_sources));
        }
      })
      .catch(() => setError("Could not reach the API. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  function selectAgent(id: string) {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;
    setSelectedId(id);
    setEnabled(new Set(agent.allowed_sources));
    setSaveState("idle");
  }

  function toggleSource(sourceId: string) {
    setEnabled((prev) => {
      const next = new Set(prev);
      next.has(sourceId) ? next.delete(sourceId) : next.add(sourceId);
      return next;
    });
    setSaveState("idle");
  }

  async function save() {
    if (!selectedId) return;
    setSaveState("saving");
    try {
      const updated = await updatePermissions(selectedId, [...enabled]);
      setAgents((prev) =>
        prev.map((a) =>
          a.id === selectedId ? { ...a, allowed_sources: updated.allowed_sources } : a
        )
      );
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
    }
  }

  const selectedAgent = agents.find((a) => a.id === selectedId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-gray-400 text-sm">
            Run:{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
              uvicorn main:app --reload
            </code>{" "}
            in the <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">backend/</code> folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-gray-800 text-sm">Pacific</span>
          <span className="text-gray-300 text-sm">/</span>
          <span className="text-gray-500 text-sm">Access Control</span>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2.5 py-1 rounded-full">
          Enterprise
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AgentSidebar agents={agents} selectedId={selectedId} onSelect={selectAgent} />

        <main className="flex-1 overflow-y-auto p-8">
          {selectedAgent ? (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">{selectedAgent.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{selectedAgent.description}</p>
              </div>

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-semibold text-gray-700">Internal Sources</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Choose which sources this agent is allowed to access.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {saveState === "saved" && (
                    <span className="text-xs text-green-600 font-medium">Saved</span>
                  )}
                  {saveState === "error" && (
                    <span className="text-xs text-red-500 font-medium">Save failed</span>
                  )}
                  <button
                    onClick={save}
                    disabled={saveState === "saving"}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {saveState === "saving" ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>

              <SourceGrid sources={sources} enabled={enabled} onToggle={toggleSource} />
            </>
          ) : (
            <p className="text-gray-400 text-sm">Select an agent to configure.</p>
          )}
        </main>
      </div>
    </div>
  );
}
