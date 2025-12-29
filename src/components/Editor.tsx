// src/components/Editor.tsx - VERSION FINALE TYPE-SAFE
import React, { useState, useRef } from 'react';
import { LegalAct, UserProfile } from '../../types';
import { calculateFees } from '../services/feeService';

// ✅ Types manquants définis
interface ActFees {
  emoluments: number;
  transport: number;
  registration: number;
  tax: number;
  total: number;
}

interface Evidence {
  id: string;
  data: string;
  timestamp: string;
}

interface EditorProps {
  act: LegalAct;
  profile: UserProfile;
  onSave: (act: LegalAct & { fees: ActFees; evidence: Evidence[] }) => void;
  onClose: () => void;
}

const defaultFees: ActFees = {
  emoluments: 0,
  transport: 0,
  registration: 0,
  tax: 0,
  total: 0,
};

const Editor: React.FC<EditorProps> = ({ act, profile, onSave, onClose }) => {
  if (!act || !profile) {
    return <div className="p-10 text-center text-slate-500">Chargement de l'acte…</div>;
  }

  const [content, setContent] = useState(act.legalContent ?? '');
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [fees, setFees] = useState<ActFees>({
    ...defaultFees,
    ...act.fees as ActFees,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'fees'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave({
        ...act,
        legalContent: content,
        evidence,
        fees,
        status: 'validated' as const,
      });
      setIsSaving(false);
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setEvidence(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          data: base64,
          timestamp: new Date().toLocaleString(),
        },
      ]);
    };
    reader.readAsDataURL(files[0]);
  };

  const updateFee = (field: keyof ActFees, value: number) => {
    const newFees = { ...fees, [field]: value };
    
    // Recalcul TVA 18%
    newFees.tax = (newFees.emoluments + newFees.transport) * 0.18;
    newFees.total = newFees.emoluments + newFees.transport + newFees.registration + newFees.tax;
    
    setFees(newFees);
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center print:hidden mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">{act.title}</h2>
          <p className="text-sm text-slate-500 font-mono">
            Dossier #{act.id?.slice(-6) || 'NOUVEL'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
          >
            <i className="fas fa-times mr-2"></i>Retour
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Sauvegarde…
              </>
            ) : (
              <>
                <i className="fas fa-check"></i>
                Valider Acte
              </>
            )}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 max-w-max print:hidden">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'edit'
              ? 'bg-white shadow-sm text-slate-900'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Édition Acte
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'fees'
              ? 'bg-white shadow-sm text-slate-900'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Émoluments
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-3">
          {activeTab === 'edit' ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[70vh] p-8 border-0 font-serif text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-xl resize-vertical"
                placeholder="Contenu de l'acte juridique..."
              />
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">
              <FeeInput
                label="Émoluments (base)"
                value={fees.emoluments}
                onChange={(v) => updateFee('emoluments', v)}
              />
              <FeeInput
                label="Frais de transport"
                value={fees.transport}
                onChange={(v) => updateFee('transport', v)}
              />
              <FeeInput
                label="Enregistrement / Greffe"
                value={fees.registration}
                onChange={(v) => updateFee('registration', v)}
              />
              <div className="pt-6 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>TVA 18% :</span>
                  <span>{fees.tax.toLocaleString()} F CFA</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-emerald-700">
                  <span>Total TTC :</span>
                  <span>{fees.total.toLocaleString()} F CFA</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Preuves */}
        <div className="space-y-4 print:hidden">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Ajouter Preuve
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf"
          />
          
          {evidence.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {evidence.map(ev => (
                <div key={ev.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <img 
                    src={ev.data} 
                    alt="Preuve"
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <p className="text-xs text-slate-500 mt-1 truncate">{ev.timestamp}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <i className="fas fa-image text-4xl mb-4 block"></i>
              <p>Aucune preuve</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeeInput: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 block">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">F CFA</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm transition-all"
        min="0"
      />
    </div>
  </div>
);

export default Editor;
