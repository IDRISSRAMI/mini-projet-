import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TicketCard from './TicketCard';
import { useAuth } from '../context/AuthProvider';

export default function AdminHome() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const { token } = useAuth();

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const p = await axios.get('http://localhost:7460/api/tickets/pending', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPending(Array.isArray(p.data) ? p.data : []);
      const h = await axios.get('http://localhost:7460/api/tickets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHistory(Array.isArray(h.data) ? h.data : []);
    } catch (e) {
      setError("Échec du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load() }, []);

  const acceptOne = async (id) => {
    try {
      await axios.patch(`http://localhost:7460/api/tickets/${id}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await load();
    } catch (e) {
      setError("Échec de l'acceptation du ticket");
    }
  };

  const refuseOne = async (id) => {
    try {
      await axios.patch(`http://localhost:7460/api/tickets/${id}/refuse`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await load();
    } catch (e) {
      setError("Échec du refus du ticket");
    }
  };

  const editOne = async (id, payload) => {
    try {
      await axios.put(`http://localhost:7460/api/tickets/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await load();
      setEditingId(null);
    } catch (e) {
      setError("Échec de la modification du ticket");
    }
  };

  const deleteOne = async (id) => {
    try {
      await axios.delete(`http://localhost:7460/api/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await load();
    } catch (e) {
      setError("Échec de la suppression du ticket");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Administrateur</h1>
          <p className="text-gray-600">Gestion des tickets et des utilisateurs</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tickets Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50">
              <h2 className="text-xl font-semibold text-gray-800">Tickets en attente</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Chargement des tickets...</p>
              </div>
            ) : pending.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun ticket en attente</h3>
                <p className="text-gray-500">Tous les tickets ont été traités</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pending.map(t => (
                  <div key={t._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    {editingId === t._id ? (
                      <div className="space-y-4">
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                          value={editTitle}
                          onChange={(e)=>setEditTitle(e.target.value)}
                          placeholder="Titre"
                        />
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                          rows={3}
                          value={editDescription}
                          onChange={(e)=>setEditDescription(e.target.value)}
                          placeholder="Description"
                        />
                        <div className="flex gap-3">
                          <button 
                            onClick={()=>editOne(t._id,{ title: editTitle, description: editDescription })} 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200"
                          >
                            Enregistrer
                          </button>
                          <button 
                            onClick={()=>setEditingId(null)} 
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1">
                          <TicketCard ticket={t} />
                        </div>
                        <div className="flex gap-2 sm:flex-col sm:items-end">
                          <button 
                            onClick={() => acceptOne(t._id)} 
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                          >
                            Accepter
                          </button>
                          <button 
                            onClick={() => refuseOne(t._id)} 
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
                          >
                            Refuser
                          </button>
                          <button 
                            onClick={()=>{ 
                              setEditingId(t._id); 
                              setEditTitle(t.title); 
                              setEditDescription(t.description); 
                            }} 
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors duration-200"
                          >
                            Modifier
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ticket History Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-semibold text-gray-800">Historique des tickets</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
              </div>
            ) : history.filter(t => t.status !== 'pending' && t.status !== 'ouvert').length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun historique de tickets</h3>
                <p className="text-gray-500">Aucun ticket traité pour le moment</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {history.filter(t => t.status !== 'pending' && t.status !== 'ouvert').map(t => (
                  <div key={t._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="text-sm text-gray-700 mb-3">
                      <span className="font-medium text-gray-900">{t.user?.username}</span>
                      <span className="text-gray-500"> · {t.user?.email}</span>
                    </div>
                    
                    {editingId === t._id ? (
                      <div className="space-y-4 bg-gray-50 rounded-xl p-4 mb-4">
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                          value={editTitle}
                          onChange={(e)=>setEditTitle(e.target.value)}
                          placeholder="Titre"
                        />
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                          rows={3}
                          value={editDescription}
                          onChange={(e)=>setEditDescription(e.target.value)}
                          placeholder="Description"
                        />
                        <div className="flex gap-3">
                          <button 
                            onClick={()=>editOne(t._id,{ title: editTitle, description: editDescription })} 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200"
                          >
                            Enregistrer
                          </button>
                          <button 
                            onClick={()=>setEditingId(null)} 
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1">
                          <TicketCard ticket={t} />
                        </div>
                        <div className="flex gap-2 sm:flex-col sm:items-end">
                          <button 
                            onClick={()=>{ 
                              setEditingId(t._id); 
                              setEditTitle(t.title); 
                              setEditDescription(t.description); 
                            }} 
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors duration-200"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => deleteOne(t._id)} 
                            className="px-4 py-2 bg-gray-700 hover:bg-black text-white rounded-lg font-medium transition-colors duration-200"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}