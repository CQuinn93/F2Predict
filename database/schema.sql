-- 2026 FIFA World Cup Database Schema
-- Based on Wikipedia: https://en.wikipedia.org/wiki/2026_FIFA_World_Cup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- VENUES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL CHECK (country IN ('United States', 'Canada', 'Mexico')),
    capacity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code TEXT NOT NULL UNIQUE, -- ISO country code (e.g., 'US', 'MX', 'BR')
    country_name TEXT NOT NULL UNIQUE,
    confederation TEXT NOT NULL, -- AFC, CAF, CONCACAF, CONMEBOL, OFC, UEFA
    fifa_ranking INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TOURNAMENT STAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tournament_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_name TEXT NOT NULL UNIQUE, -- 'Group Stage', 'Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final', 'Third Place'
    stage_order INTEGER NOT NULL UNIQUE, -- Order of stages (1=Group Stage, 2=R32, etc.)
    is_knockout BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GROUPS TABLE (Group Stage: A through L)
-- ============================================
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_name TEXT NOT NULL UNIQUE CHECK (group_name IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L')),
    tournament_stage_id UUID REFERENCES tournament_stages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GROUP_TEAMS TABLE (Teams in each group)
-- ============================================
CREATE TABLE IF NOT EXISTS group_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    position INTEGER CHECK (position BETWEEN 1 AND 4), -- Position in group (1-4)
    points INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    goal_difference INTEGER DEFAULT 0,
    matches_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    UNIQUE(group_id, team_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_number INTEGER, -- Official match number
    tournament_stage_id UUID REFERENCES tournament_stages(id),
    group_id UUID REFERENCES groups(id), -- NULL for knockout matches
    home_team_id UUID REFERENCES teams(id),
    away_team_id UUID REFERENCES teams(id),
    venue_id UUID REFERENCES venues(id),
    match_date TIMESTAMP WITH TIME ZONE,
    home_score INTEGER,
    away_score INTEGER,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'postponed', 'cancelled')),
    is_knockout BOOLEAN DEFAULT FALSE,
    round_number INTEGER, -- For knockout stages: round number within stage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER PREDICTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users(id)
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    prediction_type TEXT NOT NULL CHECK (prediction_type IN ('ante_post', 'live')),
    home_score INTEGER,
    away_score INTEGER,
    predicted_winner_id UUID REFERENCES teams(id), -- For win predictions
    points_awarded INTEGER DEFAULT 0,
    is_correct BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, match_id, prediction_type)
);

-- ============================================
-- USER POINTS TABLE (Summary of user points)
-- ============================================
CREATE TABLE IF NOT EXISTS user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE, -- References auth.users(id)
    total_points INTEGER DEFAULT 0,
    ante_post_points INTEGER DEFAULT 0,
    live_selection_points INTEGER DEFAULT 0,
    predictions_count INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMPETITIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE, -- Unique competition code for joining
    created_by UUID NOT NULL, -- References auth.users(id)
    max_users INTEGER NOT NULL DEFAULT 10,
    current_users INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMPETITION_PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS competition_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References auth.users(id)
    points INTEGER DEFAULT 0,
    rank INTEGER,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(competition_id, user_id)
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_matches_tournament_stage ON matches(tournament_stage_id);
CREATE INDEX IF NOT EXISTS idx_matches_group ON matches(group_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_predictions_user ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_group_teams_group ON group_teams(group_id);
CREATE INDEX IF NOT EXISTS idx_group_teams_team ON group_teams(team_id);
CREATE INDEX IF NOT EXISTS idx_competition_participants_competition ON competition_participants(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_participants_user ON competition_participants(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_participants ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own predictions
CREATE POLICY "Users can view own predictions" ON predictions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions" ON predictions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions" ON predictions
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see and modify their own points
CREATE POLICY "Users can view own points" ON user_points
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points" ON user_points
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own points" ON user_points
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access to competitions, users can manage their own
CREATE POLICY "Anyone can view active competitions" ON competitions
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create competitions" ON competitions
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Competition creators can update" ON competitions
    FOR UPDATE USING (auth.uid() = created_by);

-- Competition participants policies
CREATE POLICY "Anyone can view competition participants" ON competition_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join competitions" ON competition_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation" ON competition_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access to teams, matches, groups, venues (no auth required)
-- These tables don't have RLS enabled, allowing public read access
-- However, you may need to enable public access in Supabase dashboard:
-- Go to Authentication > Policies for each table and ensure SELECT is allowed for public
