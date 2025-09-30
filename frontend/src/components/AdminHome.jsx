import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TicketCard from './TicketCard'

export default function AdminHome() {
  const [pending, setPending] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const p = await axios.get('http://localhost:7460/api/tickets/pending')
      setPending(Array.isArray(p.data) ? p.data : [])
      const h = await axios.get('http://localhost:7460/api/tickets')
      setHistory(Array.isArray(h.data) ? h.data : [])
    } catch (e) {
      setError("Chargement impossible")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const acceptOne = async (id) => {
    await axios.patch(`http://localhost:7460/api/tickets/${id}/accept`)
    await load()
  }

  const refuseOne = async (id) => {
    await axios.patch(`http://localhost:7460/api/tickets/${id}/refuse`)
    await load()
  }

  const editOne = async (id, payload) => {
    await axios.put(`http://localhost:7460/api/tickets/${id}`, payload)
    await load()
    setEditingId(null)
  }

  const deleteOne = async (id) => {
    await axios.delete(`http://localhost:7460/api/tickets/${id}`)
    await load()
  }

  return (
    <div className="space-y-10">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading ? <div>Chargement...</div> : (
        <>
          <section>
            <h2 className="text-xl font-semibold text-[#3D5681] mb-3">Tickets pending</h2>
            {pending.length === 0 ? (
              <div className="text-gray-600 text-sm">Aucun ticket pending.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pending.map(t => (
                  <div key={t._id} className="bg-white/90 backdrop-blur border rounded-2xl p-4 shadow-sm">
                    {editingId === t._id ? (
                      <div className="space-y-2">
                        <input
                          className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-3 py-2"
                          value={editTitle}
                          onChange={(e)=>setEditTitle(e.target.value)}
                        />
                        <textarea
                          className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-3 py-2"
                          rows={3}
                          value={editDescription}
                          onChange={(e)=>setEditDescription(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={()=>editOne(t._id,{ title: editTitle, description: editDescription })} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg">Enregistrer</button>
                          <button onClick={()=>setEditingId(null)} className="bg-gray-300 text-gray-800 text-xs px-3 py-2 rounded-lg">Annuler</button>
                        </div>
                      </div>
                    ) : (
                      <TicketCard ticket={t} right={
                        <div className="flex gap-2">
                          <button onClick={() => acceptOne(t._id)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg">Accepter</button>
                          <button onClick={() => refuseOne(t._id)} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-lg">Refuser</button>
                          <button onClick={()=>{ setEditingId(t._id); setEditTitle(t.title); setEditDescription(t.description); }} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-2 rounded-lg">Modifier</button>
                        </div>
                      } />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#3D5681] mb-3">Historique (accepted/refused)</h2>
            {history.filter(t => t.status !== 'pending' && t.status !== 'ouvert').length === 0 ? (
              <div className="text-gray-600 text-sm">Aucun ticket.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.filter(t => t.status !== 'pending' && t.status !== 'ouvert').map(t => (
                  <div key={t._id} className="space-y-2">
                    <div className="text-sm text-gray-700">
                      <span className="font-medium text-[#3D5681]">{t.user?.username}</span>
                      <span className="text-gray-500"> · {t.user?.email}</span>
                    </div>
                    {editingId === t._id ? (
                      <div className="space-y-2 bg-white/90 backdrop-blur border rounded-2xl p-4 shadow-sm">
                        <input
                          className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-3 py-2"
                          value={editTitle}
                          onChange={(e)=>setEditTitle(e.target.value)}
                        />
                        <textarea
                          className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-3 py-2"
                          rows={3}
                          value={editDescription}
                          onChange={(e)=>setEditDescription(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={()=>editOne(t._id,{ title: editTitle, description: editDescription })} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg">Enregistrer</button>
                          <button onClick={()=>setEditingId(null)} className="bg-gray-300 text-gray-800 text-xs px-3 py-2 rounded-lg">Annuler</button>
                        </div>
                      </div>
                    ) : (
                      <TicketCard ticket={t} right={
                        <div className="flex gap-2">
                          <button onClick={()=>{ setEditingId(t._id); setEditTitle(t.title); setEditDescription(t.description); }} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-2 rounded-lg">Modifier</button>
                          <button onClick={() => deleteOne(t._id)} className="bg-gray-700 hover:bg-black text-white text-xs px-3 py-2 rounded-lg">Supprimer</button>
                        </div>
                      } />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}


