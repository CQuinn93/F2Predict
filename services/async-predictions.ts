// AsyncStorage service for managing ante post predictions locally
// All predictions are stored locally until final submission

import AsyncStorage from '@react-native-async-storage/async-storage';

const GROUP_PREDICTIONS_KEY = 'ante_post_group_predictions';
const R32_PREDICTIONS_KEY = 'ante_post_r32_predictions';
const R16_PREDICTIONS_KEY = 'ante_post_r16_predictions';
const QF_PREDICTIONS_KEY = 'ante_post_qf_predictions';
const SF_PREDICTIONS_KEY = 'ante_post_sf_predictions';
const BRONZE_FINAL_PREDICTIONS_KEY = 'ante_post_bronze_final_predictions';
const FINAL_PREDICTIONS_KEY = 'ante_post_final_predictions';
const IS_LOCKED_KEY = 'ante_post_is_locked';

export interface LocalGroupPrediction {
  match_id: string;
  home_score: number;
  away_score: number;
}

export interface LocalKnockoutPrediction {
  match_number: number;
  home_score: number;
  away_score: number;
  predicted_winner_id: string | null;
}

// Group Stage Predictions
export const saveGroupPredictions = async (predictions: Record<string, LocalGroupPrediction>) => {
  try {
    await AsyncStorage.setItem(GROUP_PREDICTIONS_KEY, JSON.stringify(predictions));
  } catch (error) {
    console.error('Error saving group predictions to AsyncStorage:', error);
    throw error;
  }
};

export const getGroupPredictions = async (): Promise<Record<string, LocalGroupPrediction>> => {
  try {
    const data = await AsyncStorage.getItem(GROUP_PREDICTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting group predictions from AsyncStorage:', error);
    return {};
  }
};

// Round of 32 Predictions
export const saveR32Predictions = async (predictions: Record<number, LocalKnockoutPrediction>) => {
  try {
    await AsyncStorage.setItem(R32_PREDICTIONS_KEY, JSON.stringify(predictions));
  } catch (error) {
    console.error('Error saving R32 predictions to AsyncStorage:', error);
    throw error;
  }
};

export const getR32Predictions = async (): Promise<Record<number, LocalKnockoutPrediction>> => {
  try {
    const data = await AsyncStorage.getItem(R32_PREDICTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting R32 predictions from AsyncStorage:', error);
    return {};
  }
};

// Round of 16 Predictions
export const saveR16Predictions = async (predictions: Record<number, LocalKnockoutPrediction>) => {
  try {
    await AsyncStorage.setItem(R16_PREDICTIONS_KEY, JSON.stringify(predictions));
  } catch (error) {
    console.error('Error saving R16 predictions to AsyncStorage:', error);
    throw error;
  }
};

export const getR16Predictions = async (): Promise<Record<number, LocalKnockoutPrediction>> => {
  try {
    const data = await AsyncStorage.getItem(R16_PREDICTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting R16 predictions from AsyncStorage:', error);
    return {};
  }
};

// Quarter Finals Predictions
export const saveQFPredictions = async (predictions: Record<number, LocalKnockoutPrediction>) => {
  try {
    await AsyncStorage.setItem(QF_PREDICTIONS_KEY, JSON.stringify(predictions));
  } catch (error) {
    console.error('Error saving QF predictions to AsyncStorage:', error);
    throw error;
  }
};

export const getQFPredictions = async (): Promise<Record<number, LocalKnockoutPrediction>> => {
  try {
    const data = await AsyncStorage.getItem(QF_PREDICTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting QF predictions from AsyncStorage:', error);
    return {};
  }
};

// Semi Finals Predictions
export const saveSFPredictions = async (predictions: Record<number, LocalKnockoutPrediction>) => {
  try {
    await AsyncStorage.setItem(SF_PREDICTIONS_KEY, JSON.stringify(predictions));
  } catch (error) {
    console.error('Error saving SF predictions to AsyncStorage:', error);
    throw error;
  }
};

export const getSFPredictions = async (): Promise<Record<number, LocalKnockoutPrediction>> => {
  try {
    const data = await AsyncStorage.getItem(SF_PREDICTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting SF predictions from AsyncStorage:', error);
    return {};
  }
};

// Bronze Final Predictions
export const saveBronzeFinalPredictions = async (predictions: Record<number, LocalKnockoutPrediction>) => {
  try {
    await AsyncStorage.setItem(BRONZE_FINAL_PREDICTIONS_KEY, JSON.stringify(predictions));
  } catch (error) {
    console.error('Error saving Bronze Final predictions to AsyncStorage:', error);
    throw error;
  }
};

export const getBronzeFinalPredictions = async (): Promise<Record<number, LocalKnockoutPrediction>> => {
  try {
    const data = await AsyncStorage.getItem(BRONZE_FINAL_PREDICTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting Bronze Final predictions from AsyncStorage:', error);
    return {};
  }
};

// Final Predictions
export const saveFinalPredictions = async (predictions: Record<number, LocalKnockoutPrediction>) => {
  try {
    await AsyncStorage.setItem(FINAL_PREDICTIONS_KEY, JSON.stringify(predictions));
  } catch (error) {
    console.error('Error saving Final predictions to AsyncStorage:', error);
    throw error;
  }
};

export const getFinalPredictions = async (): Promise<Record<number, LocalKnockoutPrediction>> => {
  try {
    const data = await AsyncStorage.getItem(FINAL_PREDICTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting Final predictions from AsyncStorage:', error);
    return {};
  }
};

// Get all predictions for batch save
export const getAllAntePostPredictions = async (): Promise<{
  group: Record<string, LocalGroupPrediction>;
  r32: Record<number, LocalKnockoutPrediction>;
  r16: Record<number, LocalKnockoutPrediction>;
  qf: Record<number, LocalKnockoutPrediction>;
  sf: Record<number, LocalKnockoutPrediction>;
  bronzeFinal: Record<number, LocalKnockoutPrediction>;
  final: Record<number, LocalKnockoutPrediction>;
}> => {
  try {
    const [group, r32, r16, qf, sf, bronzeFinal, final] = await Promise.all([
      getGroupPredictions(),
      getR32Predictions(),
      getR16Predictions(),
      getQFPredictions(),
      getSFPredictions(),
      getBronzeFinalPredictions(),
      getFinalPredictions(),
    ]);

    return { group, r32, r16, qf, sf, bronzeFinal, final };
  } catch (error) {
    console.error('Error getting all ante post predictions:', error);
    throw error;
  }
};

// Clear all ante post predictions (after successful batch save)
export const clearAllAntePostPredictions = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(GROUP_PREDICTIONS_KEY),
      AsyncStorage.removeItem(R32_PREDICTIONS_KEY),
      AsyncStorage.removeItem(R16_PREDICTIONS_KEY),
      AsyncStorage.removeItem(QF_PREDICTIONS_KEY),
      AsyncStorage.removeItem(SF_PREDICTIONS_KEY),
      AsyncStorage.removeItem(BRONZE_FINAL_PREDICTIONS_KEY),
      AsyncStorage.removeItem(FINAL_PREDICTIONS_KEY),
    ]);
  } catch (error) {
    console.error('Error clearing ante post predictions:', error);
    throw error;
  }
};

// Check if user has submitted ante-post predictions in database
export const checkAntePostLockedStatus = async (userId: string): Promise<boolean> => {
  try {
    const { supabase } = await import('@/utils/supabase');
    
    // Check if user has any ante_post predictions in the database
    // We'll check for a reasonable number of predictions (e.g., at least group stage + some knockout)
    // A complete submission would have many predictions, so we check if they have at least 10
    const { data, error } = await supabase
      .from('predictions')
      .select('id')
      .eq('user_id', userId)
      .eq('prediction_type', 'ante_post')
      .limit(10);

    if (error) {
      console.error('Error checking ante post locked status:', error);
      return false; // Default to unlocked on error
    }

    // If user has at least 10 ante_post predictions, consider them submitted
    // This is a reasonable threshold (group stage has 72 matches, so 10+ indicates submission)
    return (data?.length ?? 0) >= 10;
  } catch (error) {
    console.error('Error checking ante post locked status:', error);
    return false; // Default to unlocked on error
  }
};

// Get locked status from AsyncStorage
export const getAntePostLockedStatus = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(IS_LOCKED_KEY);
    return data === 'true';
  } catch (error) {
    console.error('Error getting ante post locked status:', error);
    return false;
  }
};

// Set locked status in AsyncStorage
export const setAntePostLockedStatus = async (isLocked: boolean) => {
  try {
    await AsyncStorage.setItem(IS_LOCKED_KEY, isLocked.toString());
  } catch (error) {
    console.error('Error setting ante post locked status:', error);
    throw error;
  }
};

// Check and update locked status from database (called on login)
export const updateAntePostLockedStatus = async (userId: string): Promise<boolean> => {
  try {
    const isLocked = await checkAntePostLockedStatus(userId);
    await setAntePostLockedStatus(isLocked);
    return isLocked;
  } catch (error) {
    console.error('Error updating ante post locked status:', error);
    return false;
  }
};
