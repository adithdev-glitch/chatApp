import React, { useContext, useState } from "react";
import NavRail from "../components/NavRail";
import Sidebar from "../components/Sidebar";
import MainTopBar from "../components/MainTopBar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { MsgContext } from "../context/msgContext";
import toast from "react-hot-toast";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useContext(MsgContext);
  const [activeNavTab, setActiveNavTab] = useState("chat");

  const handleInvite = () => {
    navigator.clipboard?.writeText(window.location.origin);
    toast.success("Invite link copied to clipboard!");
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#131418] text-white font-sans antialiased">
      {/* 1. Left Nav Rail (Icons) */}
      <NavRail activeTab={activeNavTab} setActiveTab={setActiveNavTab} />

      {/* 2. Conversations Sidebar */}
      <Sidebar />

      {/* 3. Main Chat View / Empty State */}
      <main className="flex-1 h-full flex flex-col min-w-0 bg-[#131418] overflow-hidden">
        {/* Top Header */}
        <MainTopBar onNewChat={() => setSelectedUser(null)} />

        {/* Dynamic Center Area */}
        <div className="flex-1 h-[calc(100%-4rem)] min-w-0 flex flex-col overflow-hidden">
          {!selectedUser ? (
            <NoChatSelected onInvite={handleInvite} />
          ) : (
            <ChatContainer />
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
