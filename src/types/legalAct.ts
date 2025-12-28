// src/types/legalAct.ts
export interface LegalActData {
  studyName: string;
  studyAddress: string;
  studyPhone: string;
  studyEmail: string;
  studyRC: string;
  creditor: {
    name: string;
    nationality: string;
    profession: string;
    birthDate: string;
    birthPlace: string;
    address: string;
  };
  debtor: {
    name: string;
    nationality: string;
    profession: string;
    birthDate: string;
    birthPlace: string;
    address: string;
  };
  amount: string;
  facts: string;
  deadlineDays: number;
  actType: 'SOMMATION DE PAYER' | 'SIGNIFICATION' | 'CONSTAT' | 'SAISIE';
  actDate?: string;
}
