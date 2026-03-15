import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });
            
            if (error) {
                setErrorMessage(error.message || "Failed to sign in");
            } else if (data) {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login failed", error);
            setErrorMessage("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
            <h2 className="text-2xl font-bold text-zinc-50 mb-6 text-center">Welcome Back</h2>
            {errorMessage && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </button>
            </form>
        </div>
    );
}
