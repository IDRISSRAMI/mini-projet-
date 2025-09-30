import React, { useState } from 'react'
import axios from 'axios'

export default function TicketForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await axios.post(
  'http://localhost:7460/api/tickets',
  { title, description },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)
      setTitle('')
      setDescription('')
      onCreated && onCreated()
    } catch (e) {
      setError("Échec de création du ticket")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white/80 backdrop-blur p-4 rounded-2xl shadow">
      <input
        className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3"
        placeholder="Description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="bg-[#4299E1] hover:bg-[#377fc2] transition text-white px-4 py-3 rounded-lg disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Envoi...' : 'Créer'}
      </button>
    </form>
  )
}


