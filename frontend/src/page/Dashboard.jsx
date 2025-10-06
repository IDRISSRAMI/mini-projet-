import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider"; // adjust path as needed

export default function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-white px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Dashboard
        </h1>

        {user?.isAdmin ? (
          <>
            <button
              onClick={() => navigate("/admin/home")}
              className="bg-blue-500 w-full py-4 rounded-xl mb-4 text-white text-lg font-semibold"
            >
              Admin Panel
            </button>
            <button
              onClick={() => navigate("/admin/pending")}
              className="bg-purple-500 w-full py-4 rounded-xl mb-4 text-white text-lg font-semibold"
            >
              Pending Tickets
            </button>
            <button
              onClick={() => navigate("/admin/history")}
              className="bg-indigo-500 w-full py-4 rounded-xl mb-4 text-white text-lg font-semibold"
            >
              Ticket History
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/profile")}
              className="bg-blue-500 w-full py-4 rounded-xl mb-4 text-white text-lg font-semibold"
            >
              View Profile
            </button>

            <button
              onClick={() => navigate("/tickets")}
              className="bg-green-500 w-full py-4 rounded-xl mb-4 text-white text-lg font-semibold"
            >
              View Tickets
            </button>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 w-full py-4 rounded-xl mt-8 text-white text-lg font-semibold"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}