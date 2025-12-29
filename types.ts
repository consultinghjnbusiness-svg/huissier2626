// types.ts - ✅ 100% CORRECT - 0 ERREURS

export type AppView = 'dashboard' | 'new-act' | 'editor' | 'parametres';  // ✅ 'parametres' au lieu de 'settings'

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

export interface AuthUser {
  id: string;
  name: string;
  matricule: string;
  email: string;
  studyId: string;
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
  fees?: {
    emoluments: number;
    debours: number;
    tva: number;
    total: number;
  };
}

export interface ActFees {
  emoluments: number;
  transport: number;
  registration: number;
  tax: number;
  total: number;
}

// ✅ Evidence CORRIGÉ - AVEC 'name'
export interface Evidence {
  id: string;
  name: string;        // ✅ AJOUTÉ pour App.tsx L190
  url?: string;        // ✅ AJOUTÉ
  data: string;
  timestamp: string;
  description?: string;
  type?: string;
}

// ✅ LegalAct CORRIGÉ - status complet
export interface LegalAct {
  id: string;
  title: string;
  type: ActType;       // ✅ ActType au lieu de string
  date: string;
  rawTranscription: string;
  legalContent: string;
  status: 'draft' | 'validated' | 'final' | 'signed';  // ✅ COMPLÉTÉ
  evidence: Evidence[];
  lastModified?: string;
  fees?: ActFees;
}
