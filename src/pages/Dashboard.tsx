import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2>Dossiers actifs</h2>
          <p className="text-4xl font-bold text-blue-600">12</p>
        </div>
        {/* Ajoutez d'autres cards */}
      </div>
    </div>
  );
};

export default Dashboard;
