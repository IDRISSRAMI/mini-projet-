import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TicketForm from '../components/TicketForm';
import EditTicketForm from '../components/EditTicketForm';
import { useAuth } from '../context/AuthProvider';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const { token } = useAuth();

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('http://localhost:7460/api/getall', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTickets(res.data || []);
    } catch (e) {
      setError('Échec du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreate = async (ticketData) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post('http://localhost:7460/api/cree', ticketData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTickets([res.data, ...tickets]);
    } catch (e) {
      setError('Échec de la création du ticket');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (t) => {
    setEditingId(t._id);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id, ticketData) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.put(`http://localhost:7460/api/modifier/${id}`, ticketData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updated = res.data;
      setTickets(tickets.map(t => t._id === updated._id ? updated : t));
      cancelEdit();
    } catch (e) {
      setError('Échec de la modification du ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError('');
      await axios.delete(`http://localhost:7460/api/suppreme/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTickets(tickets.filter(t => t._id !== id));
    } catch (e) {
      setError('Échec de la suppression du ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Tickets</h1>
          <p className="text-gray-600">Créez, modifiez et supprimez vos tickets de support</p>
        </div>

        <TicketForm onCreated={loadTickets} token={token} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Vos Tickets</h2>
          </div>
          
          {loading && tickets.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Chargement des tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun ticket</h3>
              <p className="text-gray-500">Commencez par créer un nouveau ticket de support</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {tickets.map((t) => (
                <li key={t._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  {editingId === t._id ? (
                    <EditTicketForm 
                      ticket={t}
                      onSave={(data) => handleUpdate(t._id, data)}
                      onCancel={cancelEdit}
                      loading={loading}
                    />
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                              <span className="text-white font-medium">{t.title.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
                            <p className="text-gray-600 mt-1">{t.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                Priorité: {t.priority}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                Statut: {t.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-col sm:items-end">
                        <button 
                          onClick={() => startEdit(t)} 
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDelete(t._id)} 
                          disabled={loading}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}