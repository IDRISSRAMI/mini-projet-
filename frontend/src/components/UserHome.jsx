import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TicketCard from './TicketCard';
import { useAuth } from '../context/AuthProvider';

export default function UserHome() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('http://localhost:7460/api/tickets/mine', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError("Impossible de charger les tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load() }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#3D5681] mb-2">Mes tickets (acceptés)</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Chargement des tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-gray-600 text-sm">Aucun ticket accepté.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {tickets.map(t => <TicketCard key={t._id} ticket={t} />)}
        </div>
      )}
    </div>
  );
}