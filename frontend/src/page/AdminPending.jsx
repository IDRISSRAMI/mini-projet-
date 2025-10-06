import React from 'react';
import AdminPending from '../components/AdminPending';

export default function AdminPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tickets en attente</h1>
          <p className="text-gray-600">Gestion des tickets en attente de traitement</p>
        </div>
        <AdminPending />
      </div>
    </div>
  );
}