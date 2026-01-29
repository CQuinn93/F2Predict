-- User Profiles Table
-- Stores user profile information including username

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT username_length_check CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
    CONSTRAINT username_format_check CHECK (username ~ '^[a-zA-Z][a-zA-Z0-9_]*$')
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Create a unique index for case-insensitive username uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username_lower ON user_profiles(LOWER(username));

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles (for leaderboards, etc.)
CREATE POLICY "Anyone can view user profiles" ON user_profiles
    FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);
