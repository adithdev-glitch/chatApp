import React, { useContext, useEffect, useState } from "react";
import {
  SlidersHorizontal,
  User,
  Users,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import { MsgContext } from "../context/msgContext";
import { UserContext } from "../context/userContext";
import { formatSidebarTime } from "../library/utils";

const Sidebar = () => {
  const token = localStorage.getItem("token");
  const {
    fetchUsers,
    filteresUser,
    selectedUser,
    setSelectedUser,
    unreadCounts = {},
  } = useContext(MsgContext);
  const { onlineUsers, user: currentUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("personal");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchUsers(token);
  }, []);

  const usersList = filteresUser || [];
  const filtered = usersList.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvatar = (u) => {
    if (u?.profilepic) return u.profilepic;
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      u?.name || "user"
    )}`;
  };

  // Total unread notifications count
  const totalUnread = Object.values(unreadCounts).reduce(
    (acc, val) => acc + (val || 0),
    0
  );

  return (
    <aside className="w-[330px] h-full bg-[#131418] border-r border-[#1e2027] flex flex-col flex-shrink-0 select-none">
      {/* Header */}
      <div className="pt-6 px-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Personal</h1>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                totalUnread > 0
                  ? "bg-[#7f1d1d] text-[#f87171]"
                  : "bg-[#2c2016] text-[#eab308]"
              }`}
            >
              {totalUnread > 0
                ? `${totalUnread} new`
                : onlineUsers.length > 0
                ? `${onlineUsers.length} online`
                : `${usersList.length}`}
            </span>
          </div>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 text-[#868c98] hover:text-white hover:bg-[#1f222a] rounded-lg transition-colors"
            title="Filter & Search"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Pills: Personal / Groups */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "personal"
                ? "bg-[#21242b] text-white shadow-sm"
                : "text-[#7b8190] hover:text-[#d1d5db]"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal</span>
          </button>

          <button
            onClick={() => setActiveTab("groups")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "groups"
                ? "bg-[#21242b] text-white shadow-sm"
                : "text-[#7b8190] hover:text-[#d1d5db]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Groups</span>
          </button>
        </div>

        {/* Search input when toggled */}
        {showSearch && (
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b1d24] text-white text-xs px-8 py-2 rounded-lg border border-[#272b36] focus:outline-none focus:border-[#38bdf8] transition-colors placeholder-[#626875]"
              autoFocus
            />
            <Search className="w-3.5 h-3.5 text-[#626875] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-[#252833]">
        {filtered.length > 0 ? (
          filtered.map((u) => {
            const isSelected = selectedUser?._id === u._id;
            const isOnline = onlineUsers.includes(u._id);
            const unreadCount = unreadCounts[u._id] || 0;
            const hasUnread = unreadCount > 0;

            // Real last message preview
            const lastMsg = u.lastMessage;
            let previewText = "No messages yet";
            if (lastMsg) {
              if (lastMsg.image && !lastMsg.text) {
                previewText = "📷 Photo";
              } else if (lastMsg.text) {
                const prefix =
                  lastMsg.senderId === currentUser?._id ? "You: " : "";
                previewText = `${prefix}${lastMsg.text}`;
              }
            }

            const timeDisplay = lastMsg?.createdAt
              ? formatSidebarTime(lastMsg.createdAt)
              : "";

            return (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "bg-[#1f222b] text-white"
                    : "hover:bg-[#1a1c23] text-[#8e95a5]"
                }`}
              >
                {/* Left: Avatar + Details */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Avatar with status dot */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={getAvatar(u)}
                      alt={u.name}
                      className="w-11 h-11 rounded-full object-cover bg-[#252833]"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#131418] ${
                        isOnline ? "bg-emerald-500" : "bg-neutral-500"
                      }`}
                    />
                  </div>

                  {/* Name + real last message snippet */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-gray-200 truncate">
                        {u.name}
                      </span>
                      {hasUnread && (
                        <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full inline-block flex-shrink-0" />
                      )}
                    </div>
                    <p
                      className={`text-xs truncate mt-0.5 ${
                        hasUnread
                          ? "text-[#38bdf8] font-medium"
                          : "text-[#717786]"
                      }`}
                    >
                      {previewText}
                    </p>
                  </div>
                </div>

                {/* Right: Real time + Unread badge (1, 2, 3...) */}
                <div className="flex flex-col items-end gap-1 pl-2 flex-shrink-0">
                  <span className="text-[11px] text-[#636875]">{timeDisplay}</span>
                  {unreadCount > 0 ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center bg-[#ef4444] text-white shadow-sm shadow-red-500/20">
                      {unreadCount}
                    </span>
                  ) : (
                    <span className="h-4" />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-[#636875] text-xs py-10">
            No contacts found
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-3.5 border-t border-[#1e2027] flex items-center justify-between text-[#707685]">
        <button
          className="p-1.5 hover:text-white hover:bg-[#1d1f27] rounded-lg transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <button
            className="p-1.5 hover:text-white hover:bg-[#1d1f27] rounded-lg transition-colors"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 hover:text-white hover:bg-[#1d1f27] rounded-lg transition-colors"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
