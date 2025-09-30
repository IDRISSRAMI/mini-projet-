import React from 'react'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  refused: 'bg-red-100 text-red-700',
  ouvert: 'bg-yellow-100 text-yellow-700',
  résolu: 'bg-green-100 text-green-700',
  fermé: 'bg-red-100 text-red-700',
}

export default function TicketCard({ ticket, right }) {
  if (!ticket) return null
  const badgeClass = statusColors[ticket.status] || 'bg-gray-100 text-gray-700'

  return (
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-[#DBEAFE] via-[#F3E8FF] to-[#FFE4E6] shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="rounded-2xl bg-white/90 backdrop-blur p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white grid place-items-center font-semibold">
              {(ticket?.title || 'T').slice(0,1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] truncate">
                {ticket?.title || '—'}
              </h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-3">
                {ticket?.description || ''}
              </p>
            </div>
          </div>
          {right && (
            <div className="shrink-0 flex items-center gap-2">
              {right}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className={`inline-flex items-center gap-2 text-[11px] sm:text-xs px-3 py-1 rounded-full font-medium ${badgeClass}`}>
            <span className={`h-2 w-2 rounded-full ${badgeClass.replace('bg-','bg-').split(' ')[0]}`}></span>
            {ticket?.status || '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
