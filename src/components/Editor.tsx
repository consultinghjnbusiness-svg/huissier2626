// src/components/Editor.tsx - VERSION FIXÉE
import React, { useState, useRef } from 'react';
import { LegalAct, UserProfile } from '../../types';
import { calculateFees } from '../services/feeService';

// ✅ Evidence UNIQUEMENT depuis types.ts (pas de redéfinition locale)
import { Evidence } from '../../types';

interface ActFees {
  emoluments: number;
  transport: number;
  registration: number;
  tax: number;
  total: number;
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
    ...(act.fees as ActFees),
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
        evidence,  // ✅ Evidence[] compatible avec types.ts
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
          name: files[0].name,  // ✅ Propriété MANQUANTE ajoutée
          url: base64,          // Renommé data → url pour matcher types.ts
          type: files[0].type,
          timestamp: new Date().toLocaleString(),
        } as Evidence,  // ✅ Typage explicite
      ]);
    };
    reader.readAsDataURL(files[0]);
  };

  const updateFee = (field: keyof ActFees, value: number) => {
    const newFees = { ...fees, [field]: value };
    newFees.tax = (newFees.emoluments + newFees.transport) * 0.18;
    newFees.total = newFees.emoluments + newFees.transport + newFees.registration + newFees.tax;
    setFees(newFees);
  };

  // ... reste du JSX IDENTIQUE (pas de changements)
  return (
    // ✅ JSX inchangé - le problème était UNIQUEMENT dans les types
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Tout le JSX reste exactement pareil */}
      {/* ... */}
    </div>
  );
};

// FeeInput INCHANGÉ
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
