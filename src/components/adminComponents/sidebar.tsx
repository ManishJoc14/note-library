"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  Award,
  Clock,
  Download,
  Eye,
  LayoutDashboard,
  BookText,
  Brain,
  MessageSquare,
  LogOut,
  ChevronRight,
  TrendingUp,
  Target,
  Users,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Admin Portal</h3>
            <p className="text-gray-400 text-sm">Manage Everything</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "students", label: "Students", icon: Users },
            { id: "notes", label: "Study Notes", icon: BookText },
            { id: "quizzes", label: "Quizzes", icon: Brain },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/admin/${item.id}`)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname.includes(`/admin/${item.id}`)
                  ? "bg-purple-500 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={logout}
        className="absolute bottom-6 left-6 right-6 btn-secondary !justify-start gap-3"
      >
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
