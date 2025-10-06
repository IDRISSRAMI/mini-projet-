import React from "react";
import { useAuth } from "../context/AuthProvider";
import UserHome from "../components/UserHome";
import AdminHome from "../components/AdminHome";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenue{user ? `, ${user.username}` : ""}
          </h1>
          <p className="text-gray-600 mt-2">
            {user 
              ? (user.isAdmin 
                  ? "Gérez les tickets de support des utilisateurs" 
                  : "Gérez vos tickets de support")
              : "Connectez-vous pour accéder à votre tableau de bord"}
          </p>
        </div>

        {user ? (
          user.isAdmin ? <AdminHome /> : <UserHome />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenue sur TicketApp</h2>
            <p className="text-gray-600 mb-8">
              Connectez-vous ou inscrivez-vous pour accéder à votre tableau de bord de gestion des tickets de support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/login" 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Se connecter
              </a>
              <a 
                href="/register" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                S'inscrire
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}