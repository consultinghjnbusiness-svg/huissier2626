// src/types/index.ts - VERSION FINALE (corrige TOUTES erreurs)
export type AppView = 'dashboard' | 'new-act' | 'editor' | 'settings';

export type ActType =
  | 'Assignation en justice'
  | 'Commandement de payer'
  | 'Constat'
  | 'Congé (Bail commercial/habitation)'
  | 'Dénonciation de saisie'
  | 'Procédure d\'expulsion'
  | 'Injonction de payer'
  | 'Mise en demeure'
  | 'Offre réelle de paiement'
  | 'PV de Saisie-Attribution'
  | 'PV de Saisie-Vente'
  | 'Signification de jugement'
  | 'Sommation de payer'
  | 'Sommation interpellative'
  | 'Saisie-contrefaçon'
  | 'Autre acte';

export type InputMethod = 'audio' | 'written';

export interface UserProfile {
  name: string;
  studyName: string;
  matricule: string;
  rccm: string;
  bankAccount: string;
  jurisdiction: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logo: string;
  fees: {
    emoluments: number;
    debours: number;
    tva: number;
    total: number;
  };
}

export interface AuthUser {
  id: string;
  studyId: string;
  email: string;
  name?: string;  // ✅ OPTIONNEL (fix Login.tsx)
}

export interface Evidence {
  id: string;
  data?: string;      // ✅ data (fix Editor.tsx)
  url?: string;       // ✅ url  
  description?: string;
  timestamp: string;
}

export interface ActFees {
  emoluments: number;
  debours: number;
  tva: number;
  total: number;
  transport?: number;     // ✅ transport (fix Editor.tsx)
  tax?: number;           // ✅ tax
  registration?: number;  // ✅ registration
}

export interface LegalAct {
  id: string;
  title: string;
  type: ActType;
  date: string;
  rawTranscription: string;
  legalContent: string;
  status: 'draft' | 'final' | 'signed' | 'validated';  // ✅ + validated
  evidence: Evidence[];  // ✅ Evidence[] (fix string[])
  fees: ActFees;
}
