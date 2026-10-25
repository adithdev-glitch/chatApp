import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, LogOut, Save } from "lucide-react";
import ChathiveLogo from "../components/ChathiveLogo.jsx";
import { SERVER_URL } from "../library/constants";

const Profile = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(user?.profilepic || "");
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const saveHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      if (imageFile) formData.append("profilepic", imageFile);
      formData.append("name", name);

      const response = await axios.post(
        `${SERVER_URL}/api/user/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (avatar && avatar.startsWith("blob:")) URL.revokeObjectURL(avatar);
    };
  }, [avatar]);

  if (!user) return <p className="text-white p-8">Loading profile...</p>;

  const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    user?.name || "user"
  )}`;

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#38bdf8]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="bg-[#131418] border border-[#21242d] p-8 w-full max-w-md rounded-3xl shadow-2xl relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/home")}
            className="p-2 text-[#7f8696] hover:text-white hover:bg-[#1d202a] rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <ChathiveLogo className="w-8 h-8" color="#38bdf8" strokeWidth={4} />
        </div>

        <h1 className="text-xl font-bold text-white mb-6 tracking-tight">
          Profile Settings
        </h1>

        {/* Avatar Upload */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#262b37] bg-[#1a1c23]">
            <img
              src={avatar || user.profilepic || defaultAvatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <label
            title="Upload photo"
            className="absolute bottom-0 right-0 bg-[#38bdf8] text-[#0f1115] p-2 rounded-full cursor-pointer hover:bg-[#0ea5e9] transition shadow-lg"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>
        </div>

        {/* Form fields */}
        <div className="w-full flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#7a8192]">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-[#191b22] text-white text-sm px-4 py-2.5 rounded-xl border border-[#262a36] focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#7a8192]">Email Address</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-[#15171d] text-[#6b7280] text-sm px-4 py-2.5 rounded-xl border border-[#20232d] cursor-not-allowed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={saveHandler}
            disabled={saving}
            className="w-full py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f1115] font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#38bdf8]/15 active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-xs font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
