import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Radio } from 'lucide-react';
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-4">
        <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2">
            <Radio className="w-8 h-8 text-indigo-500" />
            <span className="text-2xl font-black tracking-tight">PAP</span>
          </Link>
          <nav className="flex gap-4">
            <Link to="/login" className="text-zinc-400 hover:text-zinc-100 transition-colors font-medium">Login</Link>
            <Link to="/signup" className="px-4 py-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all font-medium">Sign Up</Link>
          </nav>
        </header>

        <main className="w-full flex items-center justify-center pt-20">
          <Routes>
            <Route path="/" element={
              <div className="text-center">
                <h1 className="text-5xl font-black tracking-tight mb-4">Your News, <span className="text-indigo-500">Synthesized.</span></h1>
                <p className="text-zinc-400 text-xl max-w-xl mx-auto">
                  Personal Broadcast System. Turn your favorite RSS feeds into AI-narrated podcasts automatically.
                </p>
                <div className="mt-10 flex gap-4 justify-center">
                   <Link to="/signup" className="px-8 py-3 bg-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">Get Started Free</Link>
                </div>
              </div>
            } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
