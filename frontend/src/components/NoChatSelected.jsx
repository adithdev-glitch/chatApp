import React from "react";
import ChathiveLogo from "./ChathiveLogo";

const NoChatSelected = ({ onInvite }) => {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-[#131418] select-none text-center">
      <div className="max-w-md flex flex-col items-center">
        {/* Large Chathive sparkling speech bubble icon */}
        <div className="mb-6 hover:scale-105 transition-transform duration-300">
          <ChathiveLogo className="w-36 h-36" color="#38bdf8" strokeWidth={5} />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
          Welcome to Chathive!
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-[#7c8392] leading-relaxed mb-8 max-w-sm">
          Pick a person or group from left sidebar chat list,
          <br />
          and start your conversation.
        </p>

        {/* Invite People Button */}
        <button
          onClick={onInvite}
          className="bg-[#2ca6db] hover:bg-[#2593c4] active:scale-95 text-white font-medium text-sm px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#0284c7]/20"
        >
          Invite People
        </button>
      </div>
    </div>
  );
};

export default NoChatSelected;
