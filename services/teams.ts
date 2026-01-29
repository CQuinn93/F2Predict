// Teams service - fetch teams with FIFA rankings
import { supabase } from '@/utils/supabase';

export interface TeamData {
  id: string;
  country_code: string;
  country_name: string;
  fifa_ranking: number | null;
}

// Get all teams with FIFA rankings
export const getAllTeams = async (): Promise<TeamData[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('id, country_code, country_name, fifa_ranking')
      .order('fifa_ranking', { ascending: true, nullsLast: true });

    if (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting teams:', error);
    throw error;
  }
};

// Get teams by IDs
export const getTeamsByIds = async (teamIds: string[]): Promise<TeamData[]> => {
  try {
    if (teamIds.length === 0) return [];

    const { data, error } = await supabase
      .from('teams')
      .select('id, country_code, country_name, fifa_ranking')
      .in('id', teamIds);

    if (error) {
      console.error('Error fetching teams by IDs:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting teams by IDs:', error);
    throw error;
  }
};
