// src/services/supabaseService.ts
import { supabase } from '../supabaseClient'; // Importe le client centralisé
import { LegalAct, UserProfile, AuthUser } from '../types';

export const dbService = {
  // Login simple (email/password)
  async login(email: string, password: string): Promise<AuthUser> {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) throw new Error('Utilisateur non trouvé');

    // TODO: Vérif password hashé en prod
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      studyId: user.study_id,
    };
    return authUser;
  },

  // Charger actes d'une étude
  async getActs(studyId: string): Promise<LegalAct[]> {
    const { data, error } = await supabase
      .from('acts')
      .select('*')
      .eq('study_id', studyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Sauvegarder acte
  async saveAct(act: LegalAct): Promise<LegalAct> {
    const { data, error } = await supabase
      .from('acts')
      .upsert(act)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Profile étude
  async getProfile(studyId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('studies')
      .select('*')
      .eq('id', studyId)
      .single();

    if (error) return null;
    return data;
  },

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('studies')
      .upsert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
