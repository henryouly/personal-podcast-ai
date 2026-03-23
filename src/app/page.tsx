import Link from "next/link";
import { Radio } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10" />

      <header className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full backdrop-blur-sm sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
            <Radio className="w-6 h-6 text-indigo-500" />
          </div>
          <span className="text-2xl font-black tracking-tight">PAP</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/login"
            className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 bg-white text-zinc-950 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Personal Broadcast System
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent leading-[1.1]">
            Your News, <br />
            <span className="text-indigo-500">Synthesized.</span>
          </h1>

          <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-12">
            Personal Broadcast System. Turn your favorite RSS feeds into AI-narrated
            podcasts automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="group relative px-10 py-4 bg-indigo-600 rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all overflow-hidden shadow-2xl shadow-indigo-500/25"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center border-t border-zinc-900/50">
        <p className="text-zinc-600 text-sm font-medium">
          &copy; 2026 Personal Broadcast System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
