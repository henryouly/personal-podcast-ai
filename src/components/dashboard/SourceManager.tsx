import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { Plus, Trash2, Globe, Rss, Loader2 } from "lucide-react";

export function SourceManager() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"rss" | "html">("rss");

  const utils = trpc.useUtils();
  const { data: sources, isLoading } = trpc.sources.list.useQuery();

  const addSource = trpc.sources.add.useMutation({
    onSuccess: () => {
      setName("");
      setUrl("");
      utils.sources.list.invalidate();
    },
  });

  const deleteSource = trpc.sources.delete.useMutation({
    onSuccess: () => {
      utils.sources.list.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSource.mutate({ name, url, type });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-zinc-50 mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-500" />
          Add News Source
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Source Name (e.g. Verge)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
            />
          </div>
          <div className="md:col-span-2">
            <input
              type="url"
              placeholder="https://example.com/rss"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
            />
          </div>
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "rss" | "html")}
              className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none"
            >
              <option value="rss">RSS</option>
              <option value="html">HTML</option>
            </select>
            <button
              type="submit"
              disabled={addSource.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {addSource.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
          </div>
        ) : sources?.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">
              No sources added yet. Start by adding an RSS feed above.
            </p>
          </div>
        ) : (
          sources?.map((source) => (
            <div
              key={source.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800">
                  {source.type === "rss" ? (
                    <Rss className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Globe className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">{source.name}</h3>
                  <p className="text-xs text-zinc-500 truncate max-w-[200px]">{source.url}</p>
                </div>
              </div>
              <button
                onClick={() => deleteSource.mutate({ id: source.id })}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
