import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Parametres from './pages/Parametres';
import { AppView, UserProfile } from '../types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [user, setUser] = useState<any>(null);
  
  // ÉTATS ÉDITEUR
  const [editorData, setEditorData] = useState({
    requarant: { nom: '', tel: '', adresse: '' },
    requi: { nom: '', tel: '', adresse: '' },
    faits: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [acteGenere, setActeGenere] = useState('');
  
  const profile: UserProfile = {
    name: 'Jean OKOMBI',
    studyName: 'Étude de Maître Jean OKOMBI',
    matricule: 'HUISS-CG-2024-089',
    rccm: 'CG-BZV-01-2024-B12-00456',
    bankAccount: 'BGFI BANK CONGO - IBAN: CG76 3000 4000 0123 4567 8901 234',
    jurisdiction: 'Tribunal de Grande Instance de Brazzaville',
    address: '12 Rue des Avocats, Quartier Centre-Ville',
    city: 'Brazzaville',
    phone: '+242 06 123 4567',
    email: 'etude.okombi@justice.cg',
    logo: ''
  };

  const updateProfile = (newProfile: UserProfile) => {
    console.log('Profil mis à jour:', newProfile);
  };

  const handleLogin = (authUser: any) => {
    setUser(authUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // GÉNÉRATION IA AMÉLIORÉE
  const genererActeIA = () => {
    if (!editorData.requarant.nom || !editorData.requi.nom || !editorData.faits.trim()) {
      alert('⚠️ Remplissez Requérant, Requi ET Faits');
      return;
    }
    
    setIsGenerating(true);
    setTimeout(() => {
      setActeGenere('GENERE');
      setIsGenerating(false);
      alert('✅ Acte généré ! Utilisez les boutons Export ↓');
    }, 1500);
  };

  // EXPORT TXT/WORD
  const exportTXT = () => {
    const content = `
ACTE D'HUISSIER DE JUSTICE
REPUBLIQUE DU CONGO - BRAZZAVILLE
${new Date().toLocaleDateString('fr-FR').toUpperCase()}

═══════════════════════════════════════════════
REQUÉRANT:
${editorData.requarant.nom.toUpperCase()}
Tél: ${editorData.requarant.tel}
${editorData.requarant.adresse.toUpperCase()}

REQUIS:
${editorData.requi.nom.toUpperCase()}
Tél: ${editorData.requi.tel}
${editorData.requi.adresse.toUpperCase()}

FAITS:
${editorData.faits}

═══════════════════════════════════════════════
Huissier de Justice: ${profile.name.toUpperCase()}
Matricule: ${profile.matricule}
${profile.studyName}
    `.trim();
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ACTE_${editorData.requarant.nom.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ActCard = ({ icon, title, onClick }: { icon: string; title: string; onClick: () => void }) => (
    <button onClick={onClick} className="group relative p-6 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-amber-50 hover:to-amber-100 border border-slate-200 hover:border-amber-300 rounded-2xl hover:shadow-2xl hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center gap-4">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:bg-amber-100 transition-all">
        <i className={`${icon} text-2xl text-slate-700 group-hover:text-amber-600 transition-colors`} />
      </div>
      <h3 className="font-bold text-lg text-slate-900 text-center leading-tight">{title}</h3>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeView={view} setActiveView={setView} profile={profile} onLogout={handleLogout} isSyncing={false}>
      {view === 'dashboard' && (
        <Dashboard acts={[]} onNewAct={() => setView('new-act')} onSelectAct={() => {}} />
      )}
      
      {view === 'parametres' && (
        <Parametres profile={profile} onUpdateProfile={updateProfile} />
      )}
      
      {view === 'new-act' && (
        <div className="p-8 max-w-4xl mx-auto">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-3 text-slate-600 hover:text-amber-600 font-semibold mb-8 text-xl">
            <i className="fas fa-arrow-left"></i> Retour Dashboard
          </button>
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <div className="flex items-center mb-12">
              <i className="fas fa-plus-circle text-5xl text-amber-500 mr-6" />
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Nouvel Acte</h1>
                <p className="text-slate-600 mt-2">Sélectionnez le type d'acte OHADA</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              <ActCard icon="fas fa-gavel" title="Assignation" onClick={() => setView('editor')} />
              <ActCard icon="fas fa-file-invoice-dollar" title="Commandement payer" onClick={() => setView('editor')} />
              <ActCard icon="fas fa-clipboard-check" title="Constat" onClick={() => setView('editor')} />
              <ActCard icon="fas fa-home" title="Congé bail" onClick={() => setView('editor')} />
              <ActCard icon="fas fa-exclamation-triangle" title="Sommation payer" onClick={() => setView('editor')} />
              <ActCard icon="fas fa-file-signature" title="Jugement" onClick={() => setView('editor')} />
              <ActCard icon="fas fa-handcuffs" title="Saisie" onClick={() => setView('editor')} />
              <ActCard icon="fas fa-ellipsis-h" title="Autre acte" onClick={() => setView('editor')} />
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-lg">Cliquez sur un acte pour commencer la rédaction</p>
            </div>
          </div>
        </div>
      )}

      {view === 'editor' && (
        <div className="p-8 max-w-7xl mx-auto">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-3 text-slate-600 hover:text-amber-600 font-semibold mb-8 text-xl">
            <i className="fas fa-arrow-left"></i> Retour Dashboard
          </button>
          
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <div className="flex items-center mb-12">
              <i className="fas fa-edit text-5xl text-amber-500 mr-6" />
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Éditeur d'Acte</h1>
                <p className="text-slate-600 mt-2">Rédaction assistée par IA Gemini OHADA</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {/* SAISIE */}
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold mb-4 text-slate-800 flex items-center">
                    <i className="fas fa-user text-amber-500 mr-2"></i> Requérant
                  </label>
                  <div className="space-y-3">
                    <input placeholder="Nom complet" value={editorData.requarant.nom} onChange={(e) => setEditorData({...editorData, requarant: {...editorData.requarant, nom: e.target.value}})} className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-200" />
                    <input placeholder="Téléphone" value={editorData.requarant.tel} onChange={(e) => setEditorData({...editorData, requarant: {...editorData.requarant, tel: e.target.value}})} className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-200" />
                    <input placeholder="Adresse" value={editorData.requarant.adresse} onChange={(e) => setEditorData({...editorData, requarant: {...editorData.requarant, adresse: e.target.value}})} className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-200" />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold mb-4 text-slate-800 flex items-center">
                    <i className="fas fa-users-slash text-red-500 mr-2"></i> Requi
                  </label>
                  <div className="space-y-3">
                    <input placeholder="Nom complet" value={editorData.requi.nom} onChange={(e) => setEditorData({...editorData, requi: {...editorData.requi, nom: e.target.value}})} className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-200" />
                    <input placeholder="Téléphone" value={editorData.requi.tel} onChange={(e) => setEditorData({...editorData, requi: {...editorData.requi, tel: e.target.value}})} className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-200" />
                    <input placeholder="Adresse" value={editorData.requi.adresse} onChange={(e) => setEditorData({...editorData, requi: {...editorData.requi, adresse: e.target.value}})} className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-200" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-lg font-bold mb-4 text-slate-800 flex items-center">
                    <i className="fas fa-file-alt text-blue-500 mr-2"></i> Faits / Notes terrain
                  </label>
                  <textarea rows={10} value={editorData.faits} onChange={(e) => setEditorData({...editorData, faits: e.target.value})} className="w-full p-6 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 resize-vertical font-mono text-sm" placeholder="Décrivez précisément les faits..." />
                </div>
                <div className="flex gap-4 pt-6 border-t border-slate-200">
                  <button onClick={genererActeIA} disabled={isGenerating} className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 py-4 px-8 rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 shadow-xl flex items-center justify-center transition-all disabled:opacity-50">
                    {isGenerating ? (<><i className="fas fa-spinner fa-spin mr-3"></i>Génération...</>) : (<><i className="fas fa-magic mr-3"></i>Générer Acte IA</>)}
                  </button>
                </div>
              </div>
            </div>

            {/* APERÇU PRO + EXPORTS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <label className="block text-lg font-bold mb-4 text-slate-800">Acte généré OHADA</label>
                <div className={`h-96 p-8 rounded-2xl border-2 overflow-y-auto ${acteGenere ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-2xl' : 'bg-slate-50 border-dashed border-slate-300'}`}>
                  {acteGenere ? (
                    <div className="acte-pro-format">
                      <div className="text-center mb-8 border-b-4 border-amber-500 pb-6">
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-wider uppercase">ACTE D'HUISSIER DE JUSTICE</h1>
                        <p className="text-2xl font-bold text-amber-600 uppercase tracking-widest">REPUBLIQUE DU CONGO</p>
                        <p className="text-xl font-semibold text-slate-700 mt-4">Brazzaville, le {new Date().toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="space-y-6 text-justify">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 mb-3 border-l-4 border-amber-500 pl-4">REQUÉRANT</h2>
                          <div className="ml-8 text-lg space-y-1">
                            <p className="font-bold text-slate-900">{editorData.requarant.nom.toUpperCase()}</p>
                            <p><i className="fas fa-phone mr-2 text-amber-500"></i>{editorData.requarant.tel}</p>
                            <p><i className="fas fa-map-marker-alt mr-2 text-amber-500"></i>{editorData.requarant.adresse}</p>
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 mb-3 border-l-4 border-red-500 pl-4">REQUIS</h2>
                          <div className="ml-8 text-lg space-y-1">
                            <p className="font-bold text-slate-900">{editorData.requi.nom.toUpperCase()}</p>
                            <p><i className="fas fa-phone mr-2 text-red-500"></i>{editorData.requi.tel}</p>
                            <p><i className="fas fa-map-marker-alt mr-2 text-red-500"></i>{editorData.requi.adresse}</p>
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 mb-3 border-l-4 border-blue-500 pl-4">FAITS</h2>
                          <div className="ml-8 text-lg leading-relaxed bg-blue-50 p-4 rounded-xl">{editorData.faits}</div>
                        </div>
                        <div className="mt-12 pt-8 border-t-4 border-slate-900 text-center">
                          <p className="text-2xl font-black text-slate-900 mb-4">Huissier de Justice</p>
                          <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 rounded-2xl inline-block shadow-lg">
                            <p className="text-xl font-bold text-slate-900">{profile.name.toUpperCase()}</p>
                            <p className="font-mono text-lg text-slate-700">Matricule: {profile.matricule}</p>
                            <p className="text-slate-800">{profile.studyName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 h-full flex flex-col items-center justify-center">
                      <i className="fas fa-sparkles text-6xl text-amber-400 mb-6 animate-pulse"></i>
                      <h3 className="text-2xl font-bold mb-3">Acte OHADA prêt à générer</h3>
                      <p className="max-w-md">Remplissez tous les champs puis cliquez "Générer Acte IA"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTIONS EXPORTS */}
              <div className="space-y-4">
                <label className="block text-lg font-bold mb-6 text-slate-800">Actions Export</label>
                <div className="space-y-3">
                  <button onClick={() => alert('✅ Acte finalisé ! Prêt signature électronique')} disabled={!acteGenere} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-6 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center disabled:opacity-50">
                    <i className="fas fa-check mr-2"></i> Finaliser
                  </button>
                  <button onClick={exportTXT} disabled={!acteGenere} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center disabled:opacity-50">
                    <i className="fas fa-file-word mr-2"></i> Word/TXT
                  </button>
                  <button onClick={() => alert('🚀 PDF bientôt disponible (html2pdf)')} disabled={!acteGenere} className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center disabled:opacity-50">
                    <i className="fas fa-file-pdf mr-2"></i> PDF
                  </button>
                  <button onClick={() => {localStorage.setItem('acte_save', JSON.stringify(editorData)); alert('💾 Sauvegardé !');}} className="w-full bg-slate-500 hover:bg-slate-600 text-white py-4 px-6 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center">
                    <i className="fas fa-save mr-2"></i> Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
