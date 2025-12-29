import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';

interface ParametresProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

const Parametres: React.FC<ParametresProps> = ({ profile, onUpdateProfile }) => {
  const [huissier, setHuissier] = useState<UserProfile>(profile);

  useEffect(() => {
    setHuissier(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHuissier(prev => ({ ...prev, [name]: value }));
  };

  const sauvegarder = () => {
    onUpdateProfile(huissier);
    localStorage.setItem('huissier_profile', JSON.stringify(huissier));
    alert('✅ Informations huissier sauvegardées !');
  };

  const restaurer = () => {
    localStorage.removeItem('huissier_profile');
    setHuissier(profile);
    alert('🔄 Données restaurées');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-12">
        <i className="fas fa-user-tie text-4xl text-amber-500 mr-4" />
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Paramètres Huissier</h1>
          <p className="text-slate-600 mt-1">Gestion des informations de l'étude</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-10 mb-8">
        <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center">
          <i className="fas fa-id-card mr-3 text-amber-500" />
          Identité Huissier
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Nom Complet *</label>
            <input
              name="name"
              value={huissier.name}
              onChange={handleChange}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-amber-200 focus:border-amber-400 transition-all"
              placeholder="Maître Jean OKOMBI"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Matricule *</label>
            <input
              name="matricule"
              value={huissier.matricule}
              onChange={handleChange}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-amber-200"
              placeholder="HUISS-CG-2024-089"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Nom de l'Étude</label>
            <input
              name="studyName"
              value={huissier.studyName}
              onChange={handleChange}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-amber-200"
              placeholder="Étude de Maître Jean OKOMBI"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Téléphone</label>
            <input
              name="phone"
              value={huissier.phone}
              onChange={handleChange}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-amber-200"
              placeholder="+242 06 123 4567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Email</label>
            <input
              name="email"
              type="email"
              value={huissier.email}
              onChange={handleChange}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-amber-200"
              placeholder="contact@etude.cg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Adresse complète</label>
            <textarea
              name="address"
              value={huissier.address}
              onChange={handleChange}
              rows={3}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-amber-200 resize-vertical"
              placeholder="12 Rue des Avocats, Centre-Ville, Brazzaville"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">RCCM (optionnel)</label>
            <input
              name="rccm"
              value={huissier.rccm || ''}
              onChange={handleChange}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-amber-200"
              placeholder="CG-BZV-01-2024-B12-00456"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Compte Bancaire</label>
            <input
              name="bankAccount"
              value={huissier.bankAccount || ''}
              onChange={handleChange}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-amber-200"
              placeholder="BGFI BANK CONGO - IBAN: CG76..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-200">
          <button
            onClick={sauvegarder}
            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 py-4 px-8 rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center"
          >
            <i className="fas fa-save mr-3" />
            Sauvegarder
          </button>
          <button
            onClick={restaurer}
            className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg transition-all border border-slate-300 flex items-center justify-center"
          >
            <i className="fas fa-undo mr-3" />
            Restaurer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
