// src/services/feeService.ts
import { ActType } from '../types';

const BASE_FEES: Record<ActType, number> = {
  'Sommation': 25000,
  'Assignation': 75000,
  'Constat': 35000,
  'Saisie-Mobilier': 120000,
  'Saisie-Vente': 150000,
  'Expulsion': 80000,
  'Signification': 20000,
};

export const calculateFees = (actType: ActType): number => {
  return BASE_FEES[actType] ?? 25000;
};
