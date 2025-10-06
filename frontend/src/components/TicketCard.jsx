import React from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  refused: 'bg-red-100 text-red-800 border-red-200',
  ouvert: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  résolu: 'bg-green-100 text-green-800 border-green-200',
  fermé: 'bg-red-100 text-red-800 border-red-200',
};

const priorityColors = {
  faible: 'bg-blue-100 text-blue-800',
  moyenne: 'bg-yellow-100 text-yellow-800',
  élevée: 'bg-red-100 text-red-800',
};

export default function TicketCard({ ticket, right }) {
  if (!ticket) return null;
  
  const statusClass = statusColors[ticket.status] || 'bg-gray-100 text-gray-800 border-gray-200';
  const priorityClass = priorityColors[ticket.priority] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{(ticket?.title || 'T').slice(0,1).toUpperCase()}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {ticket?.title || '—'}
            </h3>
            <p className="text-gray-600 mt-1 text-sm leading-relaxed line-clamp-2">
              {ticket?.description || ''}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}`}>
                {ticket?.status || '—'}
              </span>
              {ticket?.priority && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClass}`}>
                  {ticket.priority}
                </span>
              )}
            </div>
          </div>
          
          {right && (
            <div className="shrink-0 flex items-start gap-2">
              {right}
            </div>
          )}
        </div>
        
        {ticket.user && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <span>Par:</span>
              <span className="font-medium text-gray-700 ml-1">{ticket.user.username}</span>
              <span className="mx-2">•</span>
              <span>{ticket.user.email}</span>
            </div>
          </div>
        )}
        
        {ticket.createdAt && (
          <div className="mt-2 text-xs text-gray-400">
            Créé le: {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
          </div>
        )}
      </div>
    </div>
  );
}