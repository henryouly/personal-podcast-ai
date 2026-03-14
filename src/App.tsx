import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Radio, LayoutDashboard, Rss, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";
import { SourceManager } from "./components/dashboard/SourceManager";
import { EpisodeFeed } from "./components/dashboard/EpisodeFeed";
import { Settings } from "./components/dashboard/Settings";
import { authClient } from "./lib/auth-client";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const navItems = [
    { label: 'Feed', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Sources', icon: Rss, path: '/dashboard/sources' },
    { label: 'Settings', icon: SettingsIcon, path: '/dashboard/settings' },
  ];

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
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <button 
          onClick={() => authClient.signOut()}
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all font-medium mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen">
        <div className="max-w-6xl mx-auto py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col p-4">
            <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
              <Link to="/" className="flex items-center gap-2">
                <Radio className="w-8 h-8 text-indigo-500" />
                <span className="text-2xl font-black tracking-tight">PAP</span>
              </Link>
              <nav className="flex gap-4">
                <Link to="/login" className="text-zinc-400 hover:text-zinc-100 transition-colors font-medium">Login</Link>
                <Link to="/signup" className="px-4 py-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all font-medium">Sign Up</Link>
              </nav>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl font-black tracking-tight mb-4">Your News, <span className="text-indigo-500">Synthesized.</span></h1>
                <p className="text-zinc-400 text-xl max-w-xl mx-auto">
                  Personal Broadcast System. Turn your favorite RSS feeds into AI-narrated podcasts automatically.
                </p>
                <div className="mt-10 flex gap-4 justify-center">
                   <Link to="/signup" className="px-8 py-3 bg-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">Get Started Free</Link>
                </div>
              </div>
            </div>
          </div>
        } />
        
        <Route path="/login" element={
          <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
             <LoginForm />
          </div>
        } />
        
        <Route path="/signup" element={
          <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
             <SignupForm />
          </div>
        } />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout><EpisodeFeed /></DashboardLayout>} />
        <Route path="/dashboard/sources" element={<DashboardLayout><SourceManager /></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
