
export interface AuthUser {
  id: string;
  name: string;
  matricule: string;
  email: string;
  studyId: string;
}

export interface Evidence {
  id: string;
  data: string;
  timestamp: string;
  description?: string;
}

export interface ActFees {
  emoluments: number;
  transport: number;
  registration: number;
  tax: number;
  total: number;
}

export interface LegalAct {
  id: string;
  title: string;
  type: string;
  date: string;
  rawTranscription: string;
  legalContent: string;
  status: 'draft' | 'validated';
  evidence: Evidence[];
  lastModified?: string;
  fees?: ActFees;
}

export type AppView = 'dashboard' | 'new-act' | 'editor' | 'settings';
export type InputMethod = 'audio' | 'written';

export enum ActType {
  ASSIGNATION = 'Assignation en justice',
  COMMANDEMENT = 'Commandement de payer',
  CONSTAT = 'Constat de faits',
  CONGE = 'Congé (Bail commercial/habitation)',
  DENONCIATION = 'Dénonciation de saisie',
  EXPULSION = 'Procédure d\'expulsion',
  INJONCTION = 'Injonction de payer',
  MISE_EN_DEMEURE = 'Mise en demeure',
  OFFRE_REELLE = 'Offre réelle de paiement',
  PV_SAISIE_ATTRIBUTION = 'PV de Saisie-Attribution',
  PV_SAISIE_VENTE = 'PV de Saisie-Vente',
  SIGNIFICATION_JUGEMENT = 'Signification de jugement',
  SOMMATION_PAYER = 'Sommation de payer',
  SOMMATION_INTERPELLATIVE = 'Sommation interpellative',
  SAISIE_CONTREFACON = 'Saisie-contrefaçon',
  AUTRE = 'Autre acte'
}

export interface UserProfile {
  name: string;
  studyName: string;
  matricule: string;
  rccm?: string;
  bankAccount?: string;
  jurisdiction: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logo?: string;
}
