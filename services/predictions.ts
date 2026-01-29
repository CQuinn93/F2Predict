import { supabase } from '@/utils/supabase';

export interface Prediction {
  id: string;
  user_id: string;
  match_id: string | null; // NULL for knockout matches (user-specific brackets)
  match_number: number | null; // FIFA match number (1-72 group, 73+ knockout)
  prediction_type: 'ante_post' | 'live';
  home_score: number | null;
  away_score: number | null;
  predicted_winner_id: string | null;
  points_awarded: number | null;
  is_correct: boolean | null;
  created_at: string;
  updated_at: string;
  // Joined data
  predicted_winner?: {
    id: string;
    country_code: string;
    country_name: string;
  };
}

// Get predictions for a specific user and match
export const getUserPredictionsForMatch = async (
  userId: string,
  matchId: string
): Promise<{ ante_post: Prediction | null; live: Prediction | null }> => {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select(`
        *,
        predicted_winner:teams!predictions_predicted_winner_id_fkey(id, country_code, country_name)
      `)
      .eq('user_id', userId)
      .eq('match_id', matchId);

    if (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }

    const ante_post = data?.find((p) => p.prediction_type === 'ante_post') || null;
    const live = data?.find((p) => p.prediction_type === 'live') || null;

    return { ante_post, live };
  } catch (error) {
    console.error('Error getting user predictions for match:', error);
    throw error;
  }
};

// Get all predictions for a user
export const getUserPredictions = async (userId: string): Promise<Prediction[]> => {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select(`
        *,
        predicted_winner:teams!predictions_predicted_winner_id_fkey(id, country_code, country_name)
      `)
      .eq('user_id', userId)
      .order('match_number', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user predictions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user predictions:', error);
    throw error;
  }
};

// Get predictions by match_number (for knockout stages)
export const getUserPredictionsByMatchNumber = async (
  userId: string,
  matchNumber: number
): Promise<Prediction[]> => {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select(`
        *,
        predicted_winner:teams!predictions_predicted_winner_id_fkey(id, country_code, country_name)
      `)
      .eq('user_id', userId)
      .eq('match_number', matchNumber);

    if (error) {
      console.error('Error fetching predictions by match number:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting predictions by match number:', error);
    throw error;
  }
};

// Check if user has any Round of 32 predictions (locks group stage)
// Round of 32 matches are user-specific and don't exist in the matches table
// Instead, we check for predictions with match_number between 73-92 (Round of 32 range)
export const hasRoundOf32Predictions = async (userId: string): Promise<boolean> => {
  try {
    // Check if user has any predictions for Round of 32 matches (match_number 73-92)
    const { data: predictionsData, error: predictionsError } = await supabase
      .from('predictions')
      .select('id')
      .eq('user_id', userId)
      .eq('prediction_type', 'ante_post')
      .gte('match_number', 73)
      .lte('match_number', 88)
      .not('match_number', 'is', null)
      .limit(1);

    if (predictionsError) {
      // If it's just that no matches exist, that's fine - return false
      // Only log actual errors
      if (predictionsError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking Round of 32 predictions:', predictionsError);
      }
      return false;
    }

    return (predictionsData?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking Round of 32 predictions:', error);
    return false;
  }
};

// Create or update a prediction (group stage - uses match_id)
export const upsertPrediction = async (
  userId: string,
  matchId: string,
  predictionType: 'ante_post' | 'live',
  homeScore: number | null,
  awayScore: number | null,
  predictedWinnerId: string | null = null
): Promise<Prediction> => {
  try {
    // First get match_number from match_id
    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .select('match_number')
      .eq('id', matchId)
      .single();

    if (matchError || !matchData) {
      throw new Error('Match not found');
    }

    return upsertPredictionByMatchNumber(
      userId,
      matchData.match_number,
      predictionType,
      homeScore,
      awayScore,
      predictedWinnerId,
      matchId // Pass match_id for group stage matches
    );
  } catch (error) {
    console.error('Error upserting prediction:', error);
    throw error;
  }
};

// Create or update a prediction by match_number (for knockout stages)
export const upsertPredictionByMatchNumber = async (
  userId: string,
  matchNumber: number,
  predictionType: 'ante_post' | 'live',
  homeScore: number | null,
  awayScore: number | null,
  predictedWinnerId: string | null = null,
  matchId: string | null = null // Optional for knockout matches
): Promise<Prediction> => {
  try {
    // Prepare the data to upsert - ensure null values are properly handled
    const predictionData: {
      user_id: string;
      match_id: string | null;
      match_number: number;
      prediction_type: string;
      home_score: number | null;
      away_score: number | null;
      predicted_winner_id: string | null;
      updated_at: string;
    } = {
      user_id: userId,
      match_id: matchId ?? null,
      match_number: matchNumber,
      prediction_type: predictionType,
      home_score: homeScore ?? null,
      away_score: awayScore ?? null,
      predicted_winner_id: predictedWinnerId ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('predictions')
      .upsert(predictionData, {
        onConflict: 'user_id,match_number,prediction_type',
      })
      .select(`
        *,
        predicted_winner:teams!predictions_predicted_winner_id_fkey(id, country_code, country_name)
      `)
      .single();

    if (error) {
      console.error('Error upserting prediction:', error);
      console.error('Prediction data:', predictionData);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from upsert operation');
    }

    return data;
  } catch (error) {
    console.error('Error upserting prediction:', error);
    throw error;
  }
};
