import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user,logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(user?.profilepic || "");
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState(user.name);
  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setAvatar(URL.createObjectURL(file)); // PREVIEW
    }
  };
  
  const saveHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilepic", imageFile);
      formData.append("name", name);

      const response = await axios.post("http://localhost:8080/api/user/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" ,
          Authorization: `Bearer ${token}`,
        }
      });

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  

  if (!user) return <p>Loading...</p>;
  useEffect(() => {
    return () => {
      if (avatar) URL.revokeObjectURL(avatar);
    };
  }, [avatar]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
  <div className="bg-white dark:bg-gray-800 p-8 w-full max-w-lg rounded-xl shadow-lg transition-colors">
    <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">My Profile</h1>

    {/* Top Section: Name + Avatar */}
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      {/* Name Input */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="flex-1 border border-slate-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
      />

      {/* Avatar */}
      <div className="relative w-24 h-24 md:w-28 md:h-28">
        <img
          src={avatar || user.profilepic}
          alt="Profile"
          className="w-full h-full object-cover rounded-lg border-2 border-slate-300 dark:border-gray-600"
        />
        <label className="absolute bottom-0 right-0 bg-slate-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-slate-700 transition">
          Edit
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </label>
      </div>
    </div>

    {/* Email Input */}
    <input
      type="email"
      value={user.email}
      disabled
      className="w-full text-center border border-slate-200 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-not-allowed mb-4"
    />

    {/* Buttons */}
    <div className="flex flex-col md:flex-row gap-4">
      <button
        onClick={saveHandler}
        className="flex-1 border border-blue-600 dark:border-blue-500 text-slate-600 dark:text-blue-300 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition"
      >
        Save Changes
      </button>

      {user?.role === "admin" && (
        <button
          onClick={() => console.log("Go to Dashboard")}
          className="flex-1 bg-blue-600 dark:bg-blue-500 text-white dark:text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        >
          Dashboard
        </button>
      )}

      <button
        onClick={logout}
        className="flex-1 border border-red-600 dark:border-red-500 text-slate-600 dark:text-red-300 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition"
      >
        Logout
      </button>

      <a
        href="/home"
        className="flex-1 border border-green-600 dark:border-green-500 text-slate-600 dark:text-green-300 py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition text-center font-medium"
      >
        Go back
      </a>
    </div>
  </div>
</div>

  );
};

export default Profile;
