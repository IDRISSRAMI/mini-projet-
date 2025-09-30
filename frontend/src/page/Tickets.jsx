import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Tickets() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('moyenne')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState('moyenne')

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get('http://localhost:7460/api/getall')
      setTickets(res.data || [])
    } catch (e) {
      setError('فشل جلب التيكيتات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const res = await axios.post('http://localhost:7460/api/cree', {
        title,
        description,
        priority,
      })
      console.log(res)
      setTickets([res.data, ...tickets])
      setTitle('')
      setDescription('')
      setPriority('moyenne')
    } catch (e) {
      setError('فشل إنشاء التيكيت')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (t) => {
    setEditingId(t._id)
    setEditTitle(t.title)
    setEditDescription(t.description)
    setEditPriority(t.priority || 'moyenne')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
    setEditPriority('moyenne')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const res = await axios.put(`http://localhost:7460/api/modifier/${editingId}`, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
      })
      const updated = res.data
      setTickets(tickets.map(t => t._id === updated._id ? updated : t))
      cancelEdit()
    } catch (e) {
      setError('فشل تعديل التيكيت')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      setError('')
      await axios.delete(`http://localhost:7460/api/suppreme/${id}`)
      setTickets(tickets.filter(t => t._id !== id))
    } catch (e) {
      setError('فشل حذف التيكيت')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-[#3D5681]">التذاكر</h1>

        <form onSubmit={handleCreate} className="space-y-3 mb-6 bg-white/80 backdrop-blur p-4 rounded-2xl shadow">
          <input
            className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3"
            placeholder="العنوان"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3"
            placeholder="الوصف"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-4 py-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="faible">faible</option>
            <option value="moyenne">moyenne</option>
            <option value="élevée">élevée</option>
          </select>
          <button
            type="submit"
            className="bg-[#4299E1] hover:bg-[#377fc2] transition text-white px-4 py-3 rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'جارٍ...' : 'إنشاء'}
          </button>
        </form>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {loading && tickets.length === 0 ? (
          <div>جارٍ التحميل...</div>
        ) : (
          <ul className="space-y-3">
            {tickets.map((t) => (
              <li key={t._id} className="bg-white/80 backdrop-blur border rounded-2xl p-4 shadow-sm">
                {editingId === t._id ? (
                  <form onSubmit={handleUpdate} className="space-y-2">
                    <input
                      className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-3 py-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                    />
                    <textarea
                      className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-3 py-2"
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                    />
                    <select
                      className="w-full border border-[#89AFD2] focus:border-[#3D5681] outline-none transition rounded-lg px-3 py-2"
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      <option value="faible">faible</option>
                      <option value="moyenne">moyenne</option>
                      <option value="élevée">élevée</option>
                    </select>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded-lg disabled:opacity-50" disabled={loading}>حفظ</button>
                      <button type="button" onClick={cancelEdit} className="bg-gray-300 px-3 py-2 rounded-lg">إلغاء</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="font-medium text-[#3D5681]">{t.title}</div>
                    <div className="text-sm text-gray-600">{t.description}</div>
                    <div className="text-xs mt-1">الأولوية: {t.priority}</div>
                    <div className="text-xs">الحالة: {t.status}</div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => startEdit(t)} className="bg-yellow-500 text-white px-3 py-2 rounded-lg">تعديل</button>
                      <button onClick={() => handleDelete(t._id)} className="bg-red-600 text-white px-3 py-2 rounded-lg" disabled={loading}>حذف</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
