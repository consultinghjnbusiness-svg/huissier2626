
import React, { useState, useRef } from 'react';
import { LegalAct, Evidence, UserProfile, ActFees } from '../types';
import { calculateFees } from '../services/feeService';

interface EditorProps {
  act: LegalAct;
  profile: UserProfile;
  onSave: (act: LegalAct) => void;
  onClose: () => void;
}

const Editor: React.FC<EditorProps> = ({ act, profile, onSave, onClose }) => {
  const [content, setContent] = useState(act.legalContent);
  const [evidence, setEvidence] = useState<Evidence[]>(act.evidence || []);
  const [fees, setFees] = useState<ActFees>(act.fees || calculateFees(act.type));
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'fees'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave({ ...act, legalContent: content, evidence, fees, status: 'validated' });
      setIsSaving(false);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newEvidence: Evidence = {
          id: Date.now().toString(),
          data: base64,
          timestamp: new Date().toLocaleString(),
        };
        setEvidence([...evidence, newEvidence]);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
           <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-amber-600 transition-colors">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{act.title}</h2>
            <p className="text-xs text-slate-500 font-medium italic">République du Congo — Dossier #{act.id.slice(-6)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button 
              onClick={() => setActiveTab('edit')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <i className="fas fa-pen-nib mr-2"></i>Rédaction
            </button>
            <button 
              onClick={() => setActiveTab('fees')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'fees' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <i className="fas fa-coins mr-2"></i>Tarification
            </button>
          </div>
          <div className="w-px h-8 bg-slate-200 mx-2"></div>
          <button onClick={() => window.print()} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
            <i className="fas fa-print"></i>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 disabled:bg-slate-300"
          >
            {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check-double"></i>}
            Valider l'Acte
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {activeTab === 'edit' ? (
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden min-h-[1100px] flex flex-col transition-all print-container relative">
              <div className="watermark hidden print:block">
                {act.status === 'validated' ? 'ACTE ORIGINAL' : 'PROJET D\'ACTE'}
              </div>
              
              <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center gap-4 print:hidden sticky top-0 z-20">
                <div className="flex gap-1">
                  <ToolbarButton icon="fas fa-bold" />
                  <ToolbarButton icon="fas fa-italic" />
                  <ToolbarButton icon="fas fa-underline" />
                </div>
                <div className="w-px h-6 bg-slate-200"></div>
                <div className="flex gap-1 text-xs font-bold px-2 text-slate-500">
                  Police: Times New Roman
                </div>
                <div className="flex-1"></div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-3 border border-slate-200 rounded-md py-1">Norme OHADA / Congo</span>
              </div>
              
              <div className="p-12 md:p-24 flex-1 font-serif leading-relaxed text-slate-800 relative z-10 bg-white">
                <div className="mb-16 border-b-4 border-slate-900 pb-8 flex flex-col md:flex-row justify-between items-start">
                  <div className="space-y-1 uppercase font-bold text-[10px] tracking-wider text-slate-500">
                    <p className="text-xl mb-3 text-slate-900 font-serif leading-tight">{profile.studyName}</p>
                    <p className="text-slate-900">Maître {profile.name}</p>
                    <p>Huissier de Justice</p>
                    <p>{profile.address}</p>
                    <p>{profile.city} — RÉPUBLIQUE DU CONGO</p>
                    <p>Tél: {profile.phone}</p>
                    {profile.rccm && <p className="text-slate-900 pt-2 font-bold">RCCM: {profile.rccm}</p>}
                  </div>
                  {profile.logo && <img src={profile.logo} alt="Logo" className="w-24 h-24 object-contain" />}
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full min-h-[850px] outline-none resize-none bg-transparent text-xl leading-[1.9] text-justify font-serif"
                  spellCheck={false}
                />

                <div className="mt-20 border-t-2 border-slate-900 pt-10 flex justify-between items-start relative">
                  <div className="text-[10px] text-slate-400 space-y-1">
                    <p className="font-bold text-slate-600 uppercase border-b border-slate-100 pb-1 mb-2">Décompte des Frais (CFA)</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-64 text-slate-700">
                      <p>Émoluments:</p> <p className="text-right font-mono">{fees.emoluments.toLocaleString()}</p>
                      <p>Transport:</p> <p className="text-right font-mono">{fees.transport.toLocaleString()}</p>
                      <p>Enregistrement:</p> <p className="text-right font-mono">{fees.registration.toLocaleString()}</p>
                      <p>TVA (18%):</p> <p className="text-right font-mono">{fees.tax.toLocaleString()}</p>
                      <p className="font-bold text-slate-900 border-t-2 border-slate-900 pt-1">TOTAL TTC:</p> 
                      <p className="text-right font-bold text-slate-900 border-t-2 border-slate-900 pt-1 font-mono">{fees.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <p className="text-[10px] text-slate-500 font-bold italic mb-2">Fait à {profile.city}, le {act.date}</p>
                    <p className="text-[10px] font-bold text-slate-900 uppercase mb-8">L'HUISSIER DE JUSTICE</p>
                    
                    {/* Visual Stamp Area */}
                    <div className="w-32 h-32 border-4 border-blue-900/20 rounded-full flex flex-col items-center justify-center text-center p-2 relative opacity-80 rotate-12">
                       <p className="text-[7px] font-black text-blue-900 uppercase leading-none mb-1">REPUBLIQUE DU CONGO</p>
                       <div className="w-full h-px bg-blue-900/20 my-1"></div>
                       <p className="text-[8px] font-bold text-blue-900 leading-tight">{profile.name.toUpperCase()}</p>
                       <p className="text-[6px] text-blue-900 font-medium">HUISS. DE JUSTICE</p>
                       <div className="w-full h-px bg-blue-900/20 my-1"></div>
                       <p className="text-[7px] text-blue-900 font-black tracking-widest">{profile.matricule}</p>
                    </div>
                    
                    <p className="text-[9px] mt-4 text-slate-400 italic">Signature & Sceau de l'Étude</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="max-w-2xl mx-auto space-y-10">
                <header className="text-center">
                   <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fas fa-calculator"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Calcul des Émoluments</h3>
                  <p className="text-slate-500">Ajustez les frais de l'acte selon le tarif officiel du Congo.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FeeInput 
                    label="Émoluments Fixes" 
                    value={fees.emoluments} 
                    onChange={v => {
                      const newFees = {...fees, emoluments: v};
                      newFees.tax = (newFees.emoluments + newFees.transport) * 0.18;
                      newFees.total = newFees.emoluments + newFees.transport + newFees.registration + newFees.tax;
                      setFees(newFees);
                    }} 
                  />
                  <FeeInput 
                    label="Transport / Kilométrage" 
                    value={fees.transport} 
                    onChange={v => {
                      const newFees = {...fees, transport: v};
                      newFees.tax = (newFees.emoluments + newFees.transport) * 0.18;
                      newFees.total = newFees.emoluments + newFees.transport + newFees.registration + newFees.tax;
                      setFees(newFees);
                    }} 
                  />
                  <FeeInput 
                    label="Droits d'Enregistrement" 
                    value={fees.registration} 
                    onChange={v => {
                      const newFees = {...fees, registration: v};
                      newFees.total = newFees.emoluments + newFees.transport + newFees.registration + newFees.tax;
                      setFees(newFees);
                    }} 
                  />
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TVA (18%)</span>
                    <span className="text-xl font-bold text-slate-700">{Math.round(fees.tax).toLocaleString()} F CFA</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-3xl flex justify-between items-center shadow-2xl">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Coût Total de l'Acte</p>
                    <p className="text-4xl font-black text-amber-500 mt-1">{Math.round(fees.total).toLocaleString()} <span className="text-lg">F CFA</span></p>
                  </div>
                  <button onClick={() => setActiveTab('edit')} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all font-bold text-sm">
                    Appliquer à l'acte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6 print:hidden">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-tight">
                <i className="fas fa-camera text-amber-500"></i>
                Preuves de terrain
              </h3>
              <button onClick={() => fileInputRef.current?.click()} className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white rounded-lg transition-all">
                <i className="fas fa-plus"></i>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>

            {evidence.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {evidence.map((item) => (
                  <div key={item.id} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={item.data} alt="Preuve" className="w-full h-full object-cover" />
                    <button onClick={() => setEvidence(evidence.filter(e => e.id !== item.id))} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-[10px] font-bold uppercase">Aucune photo jointe</p>
              </div>
            )}
          </section>

          <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
            <h3 className="font-bold text-xs flex items-center gap-2 mb-4 uppercase tracking-widest text-amber-500">
              <i className="fas fa-shield-alt"></i>
              Rappel Procédural
            </h3>
            <ul className="text-[11px] space-y-3 text-slate-400 leading-relaxed">
              <li className="flex gap-2">
                <i className="fas fa-check-circle text-emerald-500 mt-0.5"></i>
                <span>L'acte doit être signifié à personne ou à domicile.</span>
              </li>
              <li className="flex gap-2 text-amber-500">
                <i className="fas fa-exclamation-triangle mt-0.5"></i>
                <span>Attention: Un décompte erroné peut rendre l'acte nul.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: string }> = ({ icon }) => (
  <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-white hover:text-amber-600 hover:shadow-sm rounded-lg transition-all">
    <i className={icon}></i>
  </button>
);

const FeeInput: React.FC<{ label: string, value: number, onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input 
        type="number" 
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500 pr-16"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">CFA</span>
    </div>
  </div>
);

export default Editor;
