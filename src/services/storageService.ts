// src/services/storageService.ts
import { supabase } from '../supabaseClient';
import { LegalAct, UserProfile } from '../types';

export const storageService = {
  async getActs(studyId: string): Promise<LegalAct[]> {
    try {
      const { data, error } = await supabase
        .from('legal_acts')
        .select('*')
        .eq('study_id', studyId)
        .order('date', { ascending: false });

      if (!error && data) {
        return data.map(row => ({
          id: row.id,
          title: row.title,
          type: row.type,
          date: row.date,
          rawTranscription: row.raw_transcription,
          legalContent: row.legal_content,
          status: row.status,
          evidence: row.evidence ?? [],
        })) as LegalAct[];
      }
    } catch (err) {
      console.error('Supabase getActs exception:', err);
    }

    const local = localStorage.getItem(`acts_${studyId}`);
    return local ? JSON.parse(local) : [];
  },

  async saveAct(studyId: string, act: LegalAct): Promise<void> {
    const existing = await this.getActs(studyId);
    const index = existing.findIndex(a => a.id === act.id);
    if (index >= 0) existing[index] = act;
    else existing.push(act);

    localStorage.setItem(`acts_${studyId}`, JSON.stringify(existing));

    try {
      const { error } = await supabase
        .from('legal_acts')
        .upsert(
          {
            id: act.id,
            study_id: studyId,
            title: act.title,
            type: act.type,
            date: act.date,
            raw_transcription: act.rawTranscription,
            legal_content: act.legalContent,
            status: act.status,
            evidence: act.evidence,
          },
          { onConflict: 'id' }
        );

      if (error) console.error('Supabase saveAct error:', error.message);
    } catch (err) {
      console.error('Supabase saveAct exception:', err);
    }
  },

  async getProfile(studyId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('study_id', studyId)
        .single();

      if (!error && data) return data as UserProfile;
    } catch (err) {
      console.error('Supabase getProfile exception:', err);
    }

    const local = localStorage.getItem(`profile_${studyId}`);
    return local ? (JSON.parse(local) as UserProfile) : null;
  },

  async saveProfile(studyId: string, profile: UserProfile): Promise<void> {
    localStorage.setItem(`profile_${studyId}`, JSON.stringify(profile));

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          { study_id: studyId, ...profile },
          { onConflict: 'study_id' }
        );

      if (error) console.error('Supabase saveProfile error:', error.message);
    } catch (err) {
      console.error('Supabase saveProfile exception:', err);
    }
  },
};
