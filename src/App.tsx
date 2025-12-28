// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';

import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Recorder from './components/Recorder';
import Editor from './components/Editor';
import Login from './components/Login';
import {
  AppView,
  LegalAct,
  ActType,
  UserProfile,
  InputMethod,
  AuthUser,
} from './types';
import { generateLegalAct } from './services/geminiService';
import { storageService } from './services/storageService';

// Liste des actes proposés dans l'écran "Quelle est la situation ?"
const ACT_TYPES: ActType[] = [
  'Assignation en justice',
  'Commandement de payer',
  'Constat',
  'Congé (Bail commercial/habitation)',
  'Dénonciation de saisie',
  'Procédure d\'expulsion',
  'Injonction de payer',
  'Mise en demeure',
  'Offre réelle de paiement',
  'PV de Saisie-Attribution',
  'PV de Saisie-Vente',
  'Signification de jugement',
  'Sommation de payer',
  'Sommation interpellative',
  'Saisie-contrefaçon',
  'Autre acte',
];

const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [view, setView] = useState<AppView>('dashboard');
  const [acts, setActs] = useState<LegalAct[]>([]);
  const [currentAct, setCurrentAct] = useState<LegalAct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ActType | null>(null);
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Refs for inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  // States for written input
  const [requerant, setRequerant] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [notes, setNotes] = useState('');

  const [profile, setProfile] = useState<UserProfile>({
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
    logo: '',
  });

  // Auto-save profile to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('huissier_profile', JSON.stringify(profile));
    }
  }, [profile, user]);

  // Initial Data Load
  useEffect(() => {
    const initApp = async () => {
      setIsInitializing(true);

      // Load saved profile from localStorage
      const savedProfile = localStorage.getItem('huissier_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const savedUser = localStorage.getItem('huissier_auth');
      if (savedUser) {
        const authenticatedUser = JSON.parse(savedUser) as AuthUser;
        setUser(authenticatedUser);

        try {
          const [cloudActs] = await Promise.all([
            storageService.getActs(authenticatedUser.studyId),
          ]);
          setActs(cloudActs);
        } catch (error) {
          console.log('Pas de cloud, mode local uniquement');
          setActs([]);
        }
      }

      setIsInitializing(false);
    };

    initApp();
  }, []);

  const handleLogin = async (authenticatedUser: AuthUser) => {
    setIsInitializing(true);
    authenticatedUser.studyId = 'STUDY_BRAZZA_01'; // démo
    setUser(authenticatedUser);
    localStorage.setItem('huissier_auth', JSON.stringify(authenticatedUser));

    // Load local profile
    const savedProfile = localStorage.getItem('huissier_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    try {
      const cloudActs = await storageService.getActs(authenticatedUser.studyId);
      setActs(cloudActs);
    } catch (error) {
      setActs([]);
    }
    setIsInitializing(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('huissier_auth');
    setView('dashboard');
  };

  const resetFlow = () => {
    setSelectedTask(null);
    setInputMethod(null);
    setRequerant('');
    setDestinataire('');
    setNotes('');
  };

  const processGeneration = async (content: string) => {
    if (!selectedTask || !user) return;
    setIsLoading(true);
    try {
      const fullPrompt =
        inputMethod === 'written'
          ? `REQUÉRANT: ${requerant}\nDESTINATAIRE: ${destinataire}\nNOTES DE TERRAIN: ${content}`
          : content;

      const draftContent = await generateLegalAct(fullPrompt, selectedTask);

      const todayIso = new Date().toISOString().split('T')[0];

      const newAct: LegalAct = {
  id: Date.now().toString(),
  title: `${selectedTask} - ${todayIso}`,
  type: selectedTask,
  date: todayIso,
  rawTranscription: fullPrompt,
  legalContent: draftContent,
  status: 'draft',
  evidence: [],
  fees: {
    emoluments: 0,      // <-- correspond à Editor.tsx
    debours: 0,         // <-- correspond à Editor.tsx
    tva: 0,             // <-- correspond à Editor.tsx
    total: 0,
  },
};


      if (user) {
        setIsSyncing(true);
        try {
          await storageService.saveAct(user.studyId, newAct);
          const updatedActs = await storageService.getActs(user.studyId);
          setActs(updatedActs);
        } catch (error) {
          console.log('Sauvegarde cloud échouée, mode local');
        }
        setIsSyncing(false);
      }

      setCurrentAct(newAct);
      setView('editor');
    } catch (error) {
      console.error('❌ Erreur génération acte :', error);
      alert("Erreur lors de la génération de l'acte juridique.");
    } finally {
      setIsLoading(false);
      resetFlow();
    }
  };

  const handleSaveAct = async (updated: LegalAct) => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await storageService.saveAct(user.studyId, updated);
      const updatedActs = await storageService.getActs(user.studyId);
      setActs(updatedActs);
    } catch (error) {
      console.log('Sauvegarde cloud échouée');
    }
    setIsSyncing(false);
    setView('dashboard');
  };

  const handleExportData = () => {
    const data = {
      profile,
      acts,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HuissierPro_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmImport = window.confirm(
      '⚠️ ATTENTION : Cela remplacera TOUS vos paramètres et actes. Continuer ?'
    );
    if (!confirmImport) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.profile && Array.isArray(json.acts)) {
          setProfile(json.profile);
          setActs(json.acts);
          alert('✅ Données importées avec succès !');
        } else {
          throw new Error('Format de fichier invalide.');
        }
      } catch (err) {
        alert('❌ Erreur : ' + (err instanceof Error ? err.message : 'Fichier corrompu'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mb-8 animate-pulse shadow-2xl shadow-amber-500/20">
          <i className="fas fa-balance-scale text-3xl text-slate-900"></i>
        </div>
        <h2 className="text-white text-2xl font-bold tracking-widest mb-2">
          HuissierPro Congo
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"></div>
          <div
            className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
            style={{ animationDelay: '75ms' }}
          ></div>
          <div
            className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest ml-2">
            Chargement sécurisé...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const filteredTasks = ACT_TYPES.filter(task =>
    task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout
      activeView={view}
      setActiveView={setView}
      profile={profile}
      onLogout={handleLogout}
      isSyncing={isSyncing}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-10">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6 shadow-xl"></div>
          <p className="text-2xl font-bold text-slate-900">Rédaction Juridique...</p>
          <p className="text-slate-500 mt-2 font-medium italic">
            Normes OHADA pour:{' '}
            <span className="text-amber-600 font-bold">{selectedTask}</span>
          </p>
        </div>
      ) : (
        <>
          {view === 'dashboard' && (
            <Dashboard
              acts={acts}
              onNewAct={() => {
                resetFlow();
                setView('new-act');
              }}
              onSelectAct={act => {
                setCurrentAct(act);
                setView('editor');
              }}
            />
          )}

          {view === 'new-act' && (
            <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
              {!selectedTask && (
                <div className="space-y-8">
                  <header className="text-center space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                      Quelle est la situation ?
                    </h2>
                    <p className="text-slate-500 font-medium">
                      Sélectionnez la mission de l'huissier à accomplir.
                    </p>
                  </header>

                  <div className="relative max-w-md mx-auto">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                      type="text"
                      placeholder="Rechercher un acte (ex: Saisie, Sommation...)"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map(task => (
                      <button
                        key={task}
                        onClick={() => setSelectedTask(task)}
                        className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl text-left hover:border-amber-500 hover:shadow-xl transition-all group"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          <i className={`fas ${getTaskIcon(task)} text-xl`}></i>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight">
                            {task}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                            Conformité Congo
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask && !inputMethod && (
                <div className="space-y-8">
                  <header className="text-center">
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="text-xs font-bold text-amber-600 mb-4 hover:underline"
                    >
                      <i className="fas fa-arrow-left mr-2"></i> Changer la situation
                    </button>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      Comment saisir les faits ?
                    </h2>
                    <p className="text-slate-500 mt-2">Choisissez votre mode de saisie.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <button
                      onClick={() => setInputMethod('audio')}
                      className="group p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-amber-500 transition-all text-center space-y-4 hover:shadow-2xl"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-3xl text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all transform group-hover:rotate-12">
                        <i className="fas fa-microphone-alt"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Dictée Vocale</h3>
                        <p className="text-sm text-slate-400 mt-1">Idéal sur le terrain</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setInputMethod('written')}
                      className="group p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-amber-500 transition-all text-center space-y-4 hover:shadow-2xl"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-3xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-rotate-12">
                        <i className="fas fa-pen-nib"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Saisie Écrite</h3>
                        <p className="text-sm text-slate-400 mt-1">Références structurées</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {selectedTask && inputMethod === 'audio' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-white">
                        <i className="fas fa-microphone"></i>
                      </div>
                      <span className="font-bold text-slate-800">{selectedTask}</span>
                    </div>
                    <button
                      onClick={() => setInputMethod(null)}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Changer
                    </button>
                  </div>
                  <Recorder
                    onTranscriptionComplete={text => processGeneration(text)}
                    onCancel={() => setInputMethod(null)}
                  />
                </div>
              )}

              {selectedTask && inputMethod === 'written' && (
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900">
                      Références du dossier
                    </h2>
                    <button
                      onClick={() => setInputMethod(null)}
                      className="text-xs font-bold text-slate-400 hover:text-red-500"
                    >
                      Changer
                    </button>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                            Requérant (A)
                          </label>
                          <input
                            type="text"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            placeholder="Nom / Société..."
                            value={requerant}
                            onChange={e => setRequerant(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                            Destinataire (B)
                          </label>
                          <input
                            type="text"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold"
                            placeholder="Partie adverse..."
                            value={destinataire}
                            onChange={e => setDestinataire(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                          Faits & Observations
                        </label>
                        <textarea
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 min-h-[150px] resize-none"
                          placeholder="Faits, montants, dates, observations..."
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => processGeneration(notes)}
                      disabled={!requerant || !destinataire || !notes}
                      className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                      <i className="fas fa-magic text-amber-500"></i>
                      Générer Acte Juridique
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'editor' && currentAct && (
            <Editor
              act={currentAct}
              profile={profile}
              onSave={handleSaveAct}
              onClose={() => setView('dashboard')}
            />
          )}

          {view === 'settings' && (
            <div className="p-6 md:p-10 max-w-4xl mx-auto">
              {/* ... reste de settings identique ... */}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

// Helper function for icons
const getTaskIcon = (task: string): string => {
  if (task.includes('Assignation')) return 'fa-gavel';
  if (task.includes('Commandement')) return 'fa-exclamation-triangle';
  if (task.includes('Constat')) return 'fa-eye';
  if (task.includes('Saisie')) return 'fa-lock';
  if (task.includes('Expulsion')) return 'fa-door-open';
  if (task.includes('Signification')) return 'fa-envelope-open-text';
  if (task.includes('Sommation')) return 'fa-bullhorn';
  return 'fa-file-alt';
};

export default App;
