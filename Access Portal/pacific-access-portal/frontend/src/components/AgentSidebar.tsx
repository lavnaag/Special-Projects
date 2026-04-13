import { Agent } from "../api";

interface Props {
  agents: Agent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AgentSidebar({ agents, selectedId, onSelect }: Props) {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Agents
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelect(agent.id)}
            className={`w-full text-left px-5 py-3 transition-colors ${
              selectedId === agent.id
                ? "bg-indigo-50 border-r-2 border-indigo-500 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <p className="text-sm font-medium truncate">{agent.name}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {agent.allowed_sources.length} source
              {agent.allowed_sources.length !== 1 ? "s" : ""} enabled
            </p>
          </button>
        ))}
      </nav>
    </aside>
  );
}
