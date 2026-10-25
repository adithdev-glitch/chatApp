import React, { useContext, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { MsgContext } from "../context/msgContext";
import { UserContext } from "../context/userContext";
import { formatMessageTime } from "../library/utils";

const ChatContainer = () => {
  const { messages = [], selectedUser, getMessages } = useContext(MsgContext);
  const { user } = useContext(UserContext);
  const messageEndRef = useRef(null);

  if (!user || !selectedUser) return null;

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getUserAvatar = (u, fallbackName) => {
    if (u?.profilepic) return u.profilepic;
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      fallbackName || "user"
    )}`;
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#131418] overflow-hidden">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-[#222530]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#676e7d] text-xs">
            <p>No messages yet. Say hello to {selectedUser.name}!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === user._id;
            const avatar = isMe
              ? getUserAvatar(user, user.name)
              : getUserAvatar(selectedUser, selectedUser.name);

            return (
              <div
                key={message._id}
                className={`flex gap-3 items-end ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover bg-[#22252c] flex-shrink-0 mb-1"
                  />
                )}

                <div
                  className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? "bg-[#0ea5e9] text-white rounded-br-xs shadow-md shadow-[#0ea5e9]/10"
                        : "bg-[#1c1e26] text-gray-200 border border-[#272a36] rounded-bl-xs"
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="rounded-xl mb-2 max-h-60 object-cover"
                      />
                    )}
                    {message.text && (
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-[#636875] mt-1 px-1">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>

                {isMe && (
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover bg-[#22252c] flex-shrink-0 mb-1"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
