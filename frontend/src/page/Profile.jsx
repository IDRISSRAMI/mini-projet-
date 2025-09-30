// Converted to React web: 2025-09-24
// Replaced View→div, Text→h1/p, Pressable→button, expo-router→react-router
import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import UpdateModal from "../components/UpdateModal";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center bg-white min-h-screen">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-[#F8F6F3] px-6 min-h-screen">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-[#3D5681]">
          Your Profile
        </h1>

        <div className="mb-4 mx-auto text-xl w-[80%] space-y-3">
          <div className="flex justify-between items-center">
            <p>Username:</p>
            <p className="font-semibold text-[#4299E1]">{user.username}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Email:</p>
            <p className="font-semibold text-[#4299E1]">{user.email}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Number:</p>
            <p className="font-semibold text-[#4299E1]">{user.number}</p>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <button
            onClick={() => setModalVisible(true)}
            className="bg-[#4299E1] py-3 rounded-2xl w-full text-white font-semibold text-base"
          >
            Update Info
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 py-3 rounded-2xl w-full text-gray-700 font-semibold text-base"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>

      <UpdateModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </div>
  );
}
