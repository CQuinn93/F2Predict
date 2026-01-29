import { supabase } from '@/utils/supabase';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

// Create or update user profile
export const upsertUserProfile = async (
  userId: string,
  username: string
): Promise<UserProfile> => {
  try {
    // Validate username before saving
    const { validateUsername } = await import('@/utils/username-validation');
    const validation = validateUsername(username.trim());
    
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid username');
    }

    // Check if username is already taken (case-insensitive)
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('username, user_id')
      .ilike('username', username.trim())
      .maybeSingle();

    if (existingProfile) {
      // If it's the same user updating their own profile, allow it
      if (existingProfile.user_id !== userId) {
        throw new Error('Username already taken. Please choose another.');
      }
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          user_id: userId,
          username: username.trim(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting user profile:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from upsert operation');
    }

    return data;
  } catch (error: any) {
    console.error('Error upserting user profile:', error);
    throw error;
  }
};

// Get user profile by user ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Get user profile by username (case-insensitive)
export const getUserProfileByUsername = async (username: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('username', username.trim())
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user profile by username:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting user profile by username:', error);
    throw error;
  }
};
