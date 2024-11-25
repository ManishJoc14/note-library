"use client";

import Sidebar from "./sidebar";
import { useState } from "react";
import { Bell } from "lucide-react";
import Notifications from "./notifications";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop(); // last part of the path

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  const capitalizedPath = capitalizeFirstLetter(lastSegment);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 p-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            {capitalizedPath}
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors relative"
            >
              <Bell size={20} className="text-white" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
            </button>
            {showNotifications && (
              <Notifications onClose={() => setShowNotifications(false)} />
            )}
          </div>
        </div>

        {children}
      </main>
    </div>
  );p
}
