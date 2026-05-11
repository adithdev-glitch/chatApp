import React, { useContext } from 'react'
import { MsgContext } from '../context/msgContext';
import { UserContext } from '../context/userContext.jsx';
import { X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatHeader = () => {
    const { selectedUser, setSelectedUser, clearChat } = useContext(MsgContext);
    const { onlineUsers } = useContext(UserContext);
    const navigate = useNavigate();

  return (
    <div className="p-3 border-b border-base-300 bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
      {/* Left: Avatar + user info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="avatar">
          <div className="w-10 h-10 rounded-full relative overflow-hidden border-2 border-gray-300 dark:border-gray-600">
            <img
              src={selectedUser.profilepic || "/avatar.png"}
              alt={selectedUser.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User info */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{selectedUser.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-2">
        {/* Go to Media button */}
        <button
          onClick={() => navigate("/media")}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Media
        </button>

        <button
        onClick={() => clearChat()}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
        >
          clear chat
        </button>


        {/* Close chat button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
