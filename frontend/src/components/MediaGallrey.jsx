import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MsgContext } from "../context/msgContext";

const MediaGallery = () => {
  const { selectedUser, user } = useContext(MsgContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      if (!selectedUser) return;

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/message/images/${selectedUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // or your auth header
          },
        });
        const imgs = res.data.map((msg) => msg.image);
        setImages(imgs);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select a chat to see shared media
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Loading images...
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No images shared in this chat
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
        Shared Media with {selectedUser.name}
      </h2>

      {/* Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="w-full h-40 overflow-hidden rounded-lg group cursor-pointer"
          >
            <img
              src={img}
              alt={`shared-${index}`}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;
