"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookText,
  Brain,
  TrendingUp,
  MessageSquare,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const { user: userData, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

    return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
            {userData?.fullName?.charAt(0) || "?"}
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {userData?.fullName || "Guest"}
            </h3>
            <p className="text-gray-400 text-sm">
              {userData?.grade ? `Grade ${userData.grade}` : "Not specified"}
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "notes", label: "Study Notes", icon: BookText },
            { id: "quizzes", label: "Quizzes", icon: Brain },
            { id: "progress", label: "Progress", icon: TrendingUp },
            { id: "feedback", label: "Feedback", icon: MessageSquare },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/student/${item.id}`)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === `/student/${item.id}`
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
}
