import React from "react";
import {
  MessageSquare,
  Phone,
  Video,
  Mail,
  BookUser,
  Layers,
  BookOpen,
  Settings,
} from "lucide-react";
import ChathiveLogo from "./ChathiveLogo";
import { useNavigate } from "react-router-dom";

const NavRail = ({ activeTab = "chat", setActiveTab }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: "chat", icon: MessageSquare, label: "Chats" },
    { id: "calls", icon: Phone, label: "Calls" },
    { id: "video", icon: Video, label: "Video" },
    { id: "mail", icon: Mail, label: "Messages" },
    { id: "contacts", icon: BookUser, label: "Contacts" },
    { id: "layers", icon: Layers, label: "Layers" },
    { id: "docs", icon: BookOpen, label: "Docs" },
  ];

  return (
    <aside className="w-[68px] h-full bg-[#0d0e12] border-r border-[#1e2027] flex flex-col items-center justify-between py-5 flex-shrink-0 select-none z-20">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-8 w-full">
        <button
          onClick={() => setActiveTab?.("chat")}
          className="p-1 rounded-xl hover:scale-105 transition-transform duration-200 focus:outline-none"
          title="Chathive"
        >
          <ChathiveLogo className="w-10 h-10" color="#38bdf8" strokeWidth={5} />
        </button>

        {/* Navigation Items Stack */}
        <nav className="flex flex-col items-center gap-3 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab?.(item.id)}
                title={item.label}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                  isActive
                    ? "text-[#38bdf8] bg-[#1a202c]"
                    : "text-[#717684] hover:text-[#d1d5db] hover:bg-[#16181f]"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#38bdf8] rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings Button */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => navigate("/profile")}
          title="Settings & Profile"
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[#717684] hover:text-white hover:bg-[#16181f] transition-colors"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>
    </aside>
  );
};

export default NavRail;
