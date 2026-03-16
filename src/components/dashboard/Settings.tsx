import { useState, useEffect } from "react";
import { trpc } from "../../lib/trpc";
import { Save, Key, Copy, Check, Loader2, Info } from "lucide-react";

export function Settings() {
  const [geminiKey, setGeminiKey] = useState("");
  const [podcastLanguage, setPodcastLanguage] = useState("English");
  const [copied, setCopied] = useState(false);

  const { data: status, isLoading } = trpc.user.getKeyStatus.useQuery();

  // Sync state with fetched data
  useEffect(() => {
    if (status?.podcastLanguage) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setPodcastLanguage(status.podcastLanguage);
    }
  }, [status?.podcastLanguage]);

  const updateKeys = trpc.user.updateKeys.useMutation({
    onSuccess: () => {
      alert("Settings updated successfully");
    },
  });

  const rssUrl = status?.rssToken
    ? `${window.location.origin}/api/rss/${status.rssToken}`
    : `${window.location.origin}/api/rss/loading...`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateKeys.mutate({
      geminiKey: geminiKey || undefined,
      podcastLanguage,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rssUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-20" />;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">API Configuration</h2>
        <p className="text-zinc-500 mb-8">
          Bring Your Own Key (BYOK). Only Gemini is required for processing.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              Gemini API Key
              {status?.gemini && (
                <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">
                  Configured
                </span>
              )}
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="password"
                placeholder="Paste your Gemini key..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:ring-2 focus:ring-indigo-500/50 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              Podcast Language
            </label>
            <select
              value={podcastLanguage}
              onChange={(e) => setPodcastLanguage(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:ring-2 focus:ring-indigo-500/50 outline-none"
            >
              <option value="English">English</option>
              <option value="Mandarin Chinese">Mandarin Chinese</option>
            </select>
            <p className="text-xs text-zinc-500">
              This will affect both script generation and the AI voice used.
            </p>
          </div>

          <button
            type="submit"
            disabled={updateKeys.isPending}
            className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {updateKeys.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Configuration
          </button>
        </form>
      </div>

      <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-zinc-50 mb-4">Your Podcast Feed</h2>
        <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
          <code className="flex-1 text-sm text-indigo-400 truncate">{rssUrl}</code>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <p className="mt-4 text-sm text-zinc-500 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          Add this URL to your favorite podcast app (Apple Podcasts, Overcast, etc.) to listen to
          your generated broadcasts.
        </p>
      </div>
    </div>
  );
}
