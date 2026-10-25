import React, { useContext, useRef, useState } from "react";
import { MsgContext } from "../context/msgContext";
import { Image, Send, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessages } = useContext(MsgContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 bg-[#131418] border-t border-[#1e2027] w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-[#2d3240]"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#20232c] hover:bg-[#2e323e] text-white flex items-center justify-center border border-[#3b4050]"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-[#1a1c23] border border-[#272a35] focus-within:border-[#38bdf8] rounded-2xl px-4 py-2 transition-colors">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[#6d7383] hover:text-[#38bdf8] transition-colors mr-2.5"
            title="Attach Image"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <input
            type="text"
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-[#606676]"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            type="button"
            className="text-[#6d7383] hover:text-[#d1d5db] transition-colors ml-2"
            title="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          className="w-11 h-11 rounded-2xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f1115] disabled:opacity-40 disabled:hover:bg-[#38bdf8] flex items-center justify-center transition-all flex-shrink-0 shadow-md shadow-[#38bdf8]/15"
          disabled={!text.trim() && !imagePreview}
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
