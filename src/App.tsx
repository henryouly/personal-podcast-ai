import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Radio, LayoutDashboard, Rss, Settings as SettingsIcon, LogOut } from "lucide-react";
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";
import { SourceManager } from "./components/dashboard/SourceManager";
import { EpisodeFeed } from "./components/dashboard/EpisodeFeed";
import { Settings } from "./components/dashboard/Settings";
import { authClient } from "./lib/auth-client";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Feed", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Sources", icon: Rss, path: "/dashboard/sources" },
    { label: "Settings", icon: SettingsIcon, path: "/dashboard/settings" },
  ];

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col p-6 fixed h-full bg-zinc-950/50 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 mb-10 px-2">
          <Radio className="w-8 h-8 text-indigo-500" />
          <span className="text-2xl font-black tracking-tight text-white">PAP</span>
        </Link>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                location.pathname === item.path
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all font-medium mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen">
        <div className="max-w-6xl mx-auto py-8">{children}</div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col relative overflow-hidden">
              {/* Background Glows */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10" />

              <header className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full backdrop-blur-sm sticky top-0 z-10">
                <Link to="/" className="flex items-center gap-2 group">
                  <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                    <Radio className="w-6 h-6 text-indigo-500" />
                  </div>
                  <span className="text-2xl font-black tracking-tight">PAP</span>
                </Link>
                <nav className="flex items-center gap-8">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
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
                      to="/signup"
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
          }
        />

        <Route
          path="/login"
          element={
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
              <LoginForm />
            </div>
          }
        />

        <Route
          path="/signup"
          element={
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
              <SignupForm />
            </div>
          }
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <EpisodeFeed />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/sources"
          element={
            <DashboardLayout>
              <SourceManager />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
