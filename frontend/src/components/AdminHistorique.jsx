import React from 'react'
import TicketCard from './TicketCard'

export default function AdminHistorique({ tickets }) {
  const treated = tickets.filter(t => t.status !== 'pending' && t.status !== 'ouvert')
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#3D5681] mb-3">Historique (accepted / refused)</h2>
      {treated.length === 0 ? (
        <div className="text-gray-600 text-sm">Aucun ticket.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {treated.map((t) => (
            <div key={t._id} className="space-y-2">
              <div className="text-sm text-gray-700">
                <span className="font-medium text-[#3D5681]">{t.user?.username}</span>
                <span className="text-gray-500"> · {t.user?.email}</span>
              </div>
              <TicketCard ticket={t} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}


