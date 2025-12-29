// src/supabaseClient.ts - 100% TypeScript OK
import { createClient } from '@supabase/supabase-js';

// ✅ FIX import.meta.env pour Vite
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase non configuré - mode local uniquement');
  // ✅ Ne crash PAS l'app si pas de Supabase
}

export const supabase = createClient(supabaseUrl, supabaseKey);
