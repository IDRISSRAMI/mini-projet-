import React from 'react'
import TicketCard from './TicketCard'

export default function AdminPending({ tickets, onAccept, onRefuse }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#3D5681] mb-3">Tickets en attente</h2>
      {tickets.length === 0 ? (
        <div className="text-gray-600 text-sm">Aucun ticket pending.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((t) => (
            <TicketCard
              key={t._id}
              ticket={t}
              right={
                <div className="flex gap-2">
                  <button onClick={() => onAccept(t._id)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg">Accepter</button>
                  <button onClick={() => onRefuse(t._id)} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-lg">Refuser</button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}


