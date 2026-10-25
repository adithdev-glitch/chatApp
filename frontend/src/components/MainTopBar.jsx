import React, { useContext, useState } from "react";
import {
  Plus,
  Search,
  Moon,
  Sun,
  Bell,
  LayoutGrid,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { UserContext } from "../context/userContext";
import { MsgContext } from "../context/msgContext";
import { useNavigate } from "react-router-dom";

const MainTopBar = ({ onNewChat }) => {
  const { user, logout } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  const userAvatar =
    user?.profilepic ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      user?.name || "current_user"
    )}`;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const { unreadCounts = {} } = useContext(MsgContext);
  const totalUnread = Object.values(unreadCounts).reduce(
    (acc, val) => acc + (val || 0),
    0
  );

  return (
    <header className="h-16 px-6 bg-[#131418] border-b border-[#1e2027] flex items-center justify-between flex-shrink-0 z-10">
      {/* Left Action: Circular + Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNewChat}
          title="New Chat"
          className="w-9 h-9 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f1115] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md shadow-[#38bdf8]/20"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <button
          className="text-[#838a99] hover:text-white transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Dark/Light toggle */}
        <button
          onClick={toggleTheme}
          className="text-[#838a99] hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {isDark ? (
            <Moon className="w-5 h-5 stroke-[1.8]" />
          ) : (
            <Sun className="w-5 h-5 stroke-[1.8]" />
          )}
        </button>

        {/* Notifications with real badge */}
        <div className="relative">
          <button
            className="text-[#838a99] hover:text-white transition-colors flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
          </button>
          {totalUnread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </div>

        {/* App Grid */}
        <button
          className="text-[#838a99] hover:text-white transition-colors"
          title="Apps"
        >
          <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Current User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#2b303c] hover:border-[#38bdf8] transition-colors focus:outline-none"
            title={user?.name || "Profile"}
          >
            <img
              src={userAvatar}
              alt={user?.name || "Profile"}
              className="w-full h-full object-cover bg-[#22252c]"
            />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1d24] border border-[#262a36] rounded-xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-[#262a36]">
                <p className="font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[#727989] truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-2 text-[#a2a9b8] hover:text-white hover:bg-[#222631] flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                Profile Settings
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  logout();
                  navigate("/");
                }}
                className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-[#222631] flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainTopBar;
