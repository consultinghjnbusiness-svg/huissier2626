// src/services/storageService.ts - ✅ 0 ERREURS L44
import { supabase } from '../supabaseClient';
import { LegalAct, UserProfile } from '../types';

interface SupabaseLegalAct {
  id: string;
  study_id: string;
  title: string;
  type: string;
  date: string;
  raw_transcription: string;
  legal_content: string;
  status: string;
  evidence?: string[];  // ✅ OPTIONNEL
  fees?: any;
}

export const storageService = {
  async getActs(studyId: string): Promise<LegalAct[]> {
    try {
      const { data } = await supabase
        .from('legal_acts')
        .select('*')
        .eq('study_id', studyId);

      if (data) {
        return data.map((row: any) => ({
          id: row.id,
          title: row.title,
          type: row.type,
          date: row.date,
          rawTranscription: row.raw_transcription || '',
          legalContent: row.legal_content || '',
          status: row.status || 'draft',
          evidence: row.evidence || [],  // ✅ L44 FIXÉ
          fees: row.fees || { emoluments: 0, debours: 0, tva: 0, total: 0 }
        }));
      }
    } catch (err) {
      console.error('Supabase error:', err);
    }

    return JSON.parse(localStorage.getItem(`acts_${studyId}`) || '[]');
  },

  async saveAct(studyId: string, act: LegalAct): Promise<void> {
    try {
      const acts = await this.getActs(studyId);
      const index = acts.findIndex(a => a.id === act.id);
      if (index >= 0) acts[index] = act;
      else acts.push(act);
      localStorage.setItem(`acts_${studyId}`, JSON.stringify(acts));

      await supabase.from('legal_acts').upsert({
        id: act.id,
        study_id: studyId,
        title: act.title,
        type: act.type,
        date: act.date,
        raw_transcription: act.rawTranscription,
        legal_content: act.legalContent,
        status: act.status,
        evidence: act.evidence || [],
        fees: act.fees
      });
    } catch (err) {
      console.error('Save error:', err);
    }
  }
} as const;
