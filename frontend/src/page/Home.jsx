import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import UserHome from "../components/UserHome";
import AdminHome from "../components/AdminHome";

export default function Home() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // data is handled in child components

  const loadUser = async () => {}
  const loadAdmin = async () => {}

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        if (!token) {
          setMyTickets([]); setPending([]); setHistory([]);
          return;
        }
        if (user?.isAdmin) {
          await loadAdmin();
        } else {
          await loadUser();
        }
      } catch (e) {
        setError("Impossible de charger les tickets");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, user?.isAdmin]);

  const acceptOne = async (id) => {
    await axios.patch(`http://localhost:7460/api/tickets/${id}/accept`);
    await loadAdmin();
  }

  const refuseOne = async (id) => {
    await axios.patch(`http://localhost:7460/api/tickets/${id}/refuse`);
    await loadAdmin();
  }

  // (Using imported TicketCard component)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-[#3D5681]">Bienvenue{user ? `, ${user.username}` : ""}</h1>
          <p className="text-gray-600">Vos tickets.</p>
        </header>

        {error && <div className="text-red-600">{error}</div>}
        {user?.isAdmin ? <AdminHome /> : <UserHome />}
      </div>
    </div>
  );
}