import React, { useState, useRef } from 'react';
import { LegalAct, Evidence, UserProfile, ActFees } from '../types';
import { calculateFees } from '../services/feeService';

interface EditorProps {
  act: LegalAct;
  profile: UserProfile;
  onSave: (act: LegalAct) => void;
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
    return <div className="p-10 text-center text-slate-500">Chargement de l’acte…</div>;
  }

  const [content, setContent] = useState(act.legalContent ?? '');
  const [evidence, setEvidence] = useState<Evidence[]>(act.evidence ?? []);
  const [fees, setFees] = useState<ActFees>({
    ...defaultFees,
    ...calculateFees(act.type),
    ...act.fees,
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
        status: 'validated',
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

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold">{act.title}</h2>
          <p className="text-xs text-slate-500 italic">
            Dossier #{act.id ? act.id.slice(-6) : 'BROUILLON'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded">
            Retour
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-emerald-600 text-white rounded"
          >
            {isSaving ? 'Sauvegarde…' : 'Valider'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {activeTab === 'edit' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[800px] p-6 border rounded font-serif"
            />
          ) : (
            <div className="space-y-4">
              <FeeInput
                label="Émoluments"
                value={fees.emoluments}
                onChange={(v) => {
                  const emoluments = v;
                  const tax = (emoluments + fees.transport) * 0.18;
                  setFees({
                    ...fees,
                    emoluments,
                    tax,
                    total: emoluments + fees.transport + fees.registration + tax,
                  });
                }}
              />

              <FeeInput
                label="Transport"
                value={fees.transport}
                onChange={(v) => {
                  const transport = v;
                  const tax = (fees.emoluments + transport) * 0.18;
                  setFees({
                    ...fees,
                    transport,
                    tax,
                    total: fees.emoluments + transport + fees.registration + tax,
                  });
                }}
              />

              <FeeInput
                label="Enregistrement"
                value={fees.registration}
                onChange={(v) =>
                  setFees({
                    ...fees,
                    registration: v,
                    total: fees.emoluments + fees.transport + v + fees.tax,
                  })
                }
              />

              <div className="font-bold">
                Total TTC : {Number(fees.total ?? 0).toLocaleString()} F CFA
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 print:hidden">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 bg-slate-100 rounded"
          >
            Ajouter une preuve
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />

          {evidence.map(ev => (
            <img key={ev.id} src={ev.data} className="rounded border" />
          ))}
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
  <div>
    <label className="text-xs font-bold">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value || 0))}
      className="w-full p-3 border rounded"
    />
  </div>
);

export default Editor;
