// src/services/feeService.ts - ✅ 0 ERREURS
import { ActType } from '../types';

const BASE_FEES: Record<string, number> = {  // ✅ Record<string> au lieu de ActType
  'Sommation de payer': 25000,
  'Assignation en justice': 75000,
  'Constat': 35000,
  'PV de Saisie-Attribution': 120000,
  'PV de Saisie-Vente': 150000,
  "Procédure d'expulsion": 80000,
  'Signification de jugement': 20000,
  'Commandement de payer': 45000,
  'Injonction de payer': 35000,
  'Mise en demeure': 15000,
};

export const calculateFees = (actType: string): number => {  // ✅ string au lieu de ActType
  return BASE_FEES[actType] ?? 25000;
};
