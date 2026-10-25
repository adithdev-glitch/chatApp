import React, { useContext } from "react";
import { MsgContext } from "../context/msgContext";
import { UserContext } from "../context/userContext.jsx";
import { X, Phone, Video, Image as ImageIcon, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, clearChat } = useContext(MsgContext);
  const { onlineUsers } = useContext(UserContext);
  const navigate = useNavigate();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);
  const avatarUrl =
    selectedUser.profilepic ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      selectedUser.name || "user"
    )}`;

  return (
    <div className="h-16 px-5 border-b border-[#1e2027] bg-[#131418] flex items-center justify-between select-none flex-shrink-0">
      {/* Left: Avatar + Details */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full object-cover bg-[#22252c]"
          />
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#131418] ${
              isOnline ? "bg-emerald-500" : "bg-neutral-500"
            }`}
          />
        </div>

        <div>
          <h3 className="font-semibold text-sm text-white">{selectedUser.name}</h3>
          <p className="text-xs text-[#717786]">
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 text-[#7f8695] hover:text-white hover:bg-[#1d1f27] rounded-lg transition-colors"
          title="Voice Call"
        >
          <Phone className="w-4 h-4" />
        </button>

        <button
          className="p-2 text-[#7f8695] hover:text-white hover:bg-[#1d1f27] rounded-lg transition-colors"
          title="Video Call"
        >
          <Video className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate("/media")}
          className="p-2 text-[#7f8695] hover:text-white hover:bg-[#1d1f27] rounded-lg transition-colors"
          title="Media Gallery"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => clearChat()}
          className="p-2 text-[#7f8695] hover:text-red-400 hover:bg-[#1d1f27] rounded-lg transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-[#252833] mx-1" />

        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 text-[#7f8695] hover:text-white hover:bg-[#1d1f27] rounded-lg transition-colors"
          title="Close Chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
