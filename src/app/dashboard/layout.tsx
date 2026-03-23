"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Radio, LayoutDashboard, Rss, Settings as SettingsIcon, LogOut } from "lucide-react";
import { authClient } from "../../lib/auth-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Feed", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Sources", icon: Rss, path: "/dashboard/sources" },
    { label: "Settings", icon: SettingsIcon, path: "/dashboard/settings" },
  ];

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col p-6 fixed h-full bg-zinc-950/50 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 mb-10 px-2">
          <Radio className="w-8 h-8 text-indigo-500" />
          <span className="text-2xl font-black tracking-tight text-white">PAP</span>
        </Link>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                pathname === item.path
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
