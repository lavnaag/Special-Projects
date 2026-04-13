import { Source } from "../api";

const CATEGORY_COLORS: Record<string, string> = {
  Knowledge:     "bg-violet-100 text-violet-700",
  Communication: "bg-blue-100 text-blue-700",
  CRM:           "bg-green-100 text-green-700",
  Storage:       "bg-yellow-100 text-yellow-700",
  "Project Mgmt":"bg-orange-100 text-orange-700",
  Engineering:   "bg-gray-100 text-gray-700",
  Support:       "bg-rose-100 text-rose-700",
};

interface Props {
  sources: Source[];
  enabled: Set<string>;
  onToggle: (id: string) => void;
}

export function SourceGrid({ sources, enabled, onToggle }: Props) {
  const grouped = sources.reduce<Record<string, Source[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {category}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((source) => {
              const on = enabled.has(source.id);
              return (
                <button
                  key={source.id}
                  onClick={() => onToggle(source.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    on
                      ? "border-indigo-300 bg-indigo-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {/* Toggle pill */}
                  <div
                    className={`mt-0.5 w-9 h-5 rounded-full flex-shrink-0 transition-colors relative ${
                      on ? "bg-indigo-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        on ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">
                        {source.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          CATEGORY_COLORS[source.category] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {source.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">
                      {source.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
