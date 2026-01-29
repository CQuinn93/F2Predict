-- Enable public read access to public tables
-- Run this SQL in Supabase SQL Editor to allow unauthenticated users to read fixtures

-- Enable RLS but allow public SELECT access
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_stages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to matches
CREATE POLICY "Public can read matches" ON matches
    FOR SELECT
    USING (true);

-- Allow public read access to teams
CREATE POLICY "Public can read teams" ON teams
    FOR SELECT
    USING (true);

-- Allow public read access to venues
CREATE POLICY "Public can read venues" ON venues
    FOR SELECT
    USING (true);

-- Allow public read access to groups
CREATE POLICY "Public can read groups" ON groups
    FOR SELECT
    USING (true);

-- Allow public read access to tournament_stages
CREATE POLICY "Public can read tournament_stages" ON tournament_stages
    FOR SELECT
    USING (true);

-- Allow public read access to group_teams
ALTER TABLE group_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read group_teams" ON group_teams
    FOR SELECT
    USING (true);
