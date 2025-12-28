// Types de vues de l'application
export type AppView = 'dashboard' | 'new-act' | 'editor' | 'settings';

// Types d'actes gérés par HuissierPro
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

export interface LegalAct {
  id: string;
  title: string;
  type: ActType;
  date: string;
  rawTranscription: string;
  legalContent: string;
  status: 'draft' | 'final';
  evidence: string[];
  fees: ActFees; // <-- ajouté
}

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
}

export interface AuthUser {
  id: string;
  studyId: string;
  email: string;
}

// Types manquants pour Editor.tsx
export interface Evidence {
  id: string;
  url: string;
  description: string;
  timestamp: string;
}

export interface ActFees {
  emoluments: number;    // <-- changé
  debours: number;       // <-- ajouté  
  tva: number;           // <-- ajouté
  total: number;
}

export interface LegalAct {
  id: string;
  title: string;
  type: ActType;
  date: string;
  rawTranscription: string;
  legalContent: string;
  status: 'draft' | 'final';
  evidence: string[];
  fees: ActFees;         // <-- avec la nouvelle structure
}
