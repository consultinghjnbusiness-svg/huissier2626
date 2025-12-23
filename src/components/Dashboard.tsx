import React from 'react';
import { LegalAct } from '../types';

interface DashboardProps {
  acts: LegalAct[];
  onSelectAct: (act: LegalAct) => void;
  onNewAct: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  acts,
  onSelectAct,
  onNewAct,
}) => {
  const totalEvidence = acts.reduce(
    (acc, act) => acc + (act.evidence?.length || 0),
    0,
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 legal-title">
            Tableau de Bord
          </h2>
          <p className="text-slate-500">
            Gérez vos actes et preuves en un seul endroit.
          </p>
        </div>
        <button
          onClick={onNewAct}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105"
        >
          <i className="fas fa-microphone-alt text-xl" />
          Démarrer une Dictée
        </button>
      </header>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Actes Actifs"
          value={acts.length.toString()}
          icon="fas fa-file-invoice"
          color="blue"
        />
        <StatCard
          title="Preuves Photo"
          value={totalEvidence.toString()}
          icon="fas fa-camera"
          color="amber"
        />
        <StatCard
          title="Conformité"
          value="100%"
          icon="fas fa-shield-alt"
          color="emerald"
        />
      </div>

      {/* Archives */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 tracking-tight">
            Archives &amp; Brouillons
          </h3>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase font-bold tracking-tighter">
            République du Congo
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Titre / Dossier</th>
                <th className="px-6 py-4 text-center">Preuves</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {acts.length > 0 ? (
                acts.map(act => (
                  <tr
                    key={act.id}
                    className="group hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => onSelectAct(act)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {act.title}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-tighter">
                        {act.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {act.evidence && act.evidence.length > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-bold">
                          <i className="fas fa-images" />
                          {act.evidence.length}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          act.status === 'final'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {act.status === 'final' ? 'Acté' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {act.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectAct(act);
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center mx-auto"
                      >
                        <i className="fas fa-pen-nib" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400 italic"
                  >
                    <div className="text-3xl mb-2">📂</div>
                    Votre étude est vide. Commencez une nouvelle dictée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'amber' | 'emerald';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  const colors: Record<StatCardProps['color'], string> = {
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
          colors[color]
        }`}
      >
        <i className={icon} />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-black text-slate-900 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
