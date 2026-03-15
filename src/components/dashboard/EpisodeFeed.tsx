import { trpc } from "../../lib/trpc";
import { RefreshCw, AlertCircle, Clock, CheckCircle2, Loader2, Zap } from "lucide-react";

export function EpisodeFeed() {
  const utils = trpc.useUtils();
  const { data: episodes, isLoading } = trpc.episodes.list.useQuery(undefined, {
    refetchInterval: (query) => {
      // Polling if there are pending episodes
      const hasPending = query.state.data?.some((ep) => ep.status === "pending");
      return hasPending ? 3000 : false;
    },
  });

  const { data: sources } = trpc.sources.list.useQuery();

  const triggerPipeline = trpc.episodes.trigger.useMutation({
    onSuccess: () => {
      utils.episodes.list.invalidate();
    },
  });

  const retryEpisode = trpc.episodes.retry.useMutation({
    onSuccess: () => {
      utils.episodes.list.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-50">Episode Feed</h2>
        <div className="flex gap-2">
          {sources?.map((source) => (
            <button
              key={source.id}
              onClick={() => triggerPipeline.mutate({ sourceId: source.id })}
              disabled={triggerPipeline.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              Update {source.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {episodes?.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
            <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-400">No episodes yet</h3>
            <p className="text-zinc-600 mt-2">
              Trigger an update from one of your sources to begin.
            </p>
          </div>
        ) : (
          episodes?.map((episode) => (
            <div
              key={episode.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    episode.status === "done"
                      ? "bg-green-500/10 border-green-500/20 text-green-500"
                      : episode.status === "failed"
                        ? "bg-red-500/10 border-red-500/20 text-red-500"
                        : "bg-indigo-500/10 border-indigo-500/20 text-indigo-500"
                  }`}
                >
                  {episode.status === "done" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : episode.status === "failed" ? (
                    <AlertCircle className="w-6 h-6" />
                  ) : (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-lg">{episode.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 text-xs font-mono uppercase">
                      {episode.sourceName}
                    </span>
                    <span>•</span>
                    <span>
                      {episode.createdAt
                        ? new Date(episode.createdAt).toLocaleString()
                        : "Just now"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                {episode.status === "done" && episode.audioUrl && (
                  <audio controls className="h-10 w-full md:w-64 accent-indigo-500">
                    <source src={episode.audioUrl} type="audio/mpeg" />
                  </audio>
                )}

                {episode.status === "failed" && (
                  <button
                    onClick={() => retryEpisode.mutate({ id: episode.id })}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-semibold transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                )}

                {episode.status === "pending" && (
                  <span className="text-zinc-500 text-sm italic animate-pulse">
                    Synthesizing...
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
