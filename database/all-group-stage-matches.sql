-- All Group Stage Matches for 2026 FIFA World Cup
-- Based on standard format: 12 groups × 6 matches per group = 72 matches total
-- Each group of 4 teams plays: Team1 vs Team2, Team1 vs Team3, Team1 vs Team4, Team2 vs Team3, Team2 vs Team4, Team3 vs Team4
-- Source: https://en.wikipedia.org/wiki/2026_FIFA_World_Cup#Group_stage

-- ============================================
-- GENERATE ALL GROUP STAGE MATCHES
-- ============================================

DO $$
DECLARE
    group_stage_id UUID;
    match_num INTEGER := 1;
    base_date DATE := '2026-06-11';
    group_names TEXT[] := ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    group_letter TEXT;
    venue_ids UUID[];
    group_idx INTEGER;
    day_offset INTEGER;
BEGIN
    -- Get tournament stage ID
    SELECT id INTO group_stage_id FROM tournament_stages WHERE stage_name = 'Group Stage';
    
    -- Get all venue IDs as array (we'll distribute matches across venues)
    SELECT ARRAY_AGG(id) INTO venue_ids FROM venues;

    -- Process each group
    group_idx := 0;
    FOREACH group_letter IN ARRAY group_names
    LOOP
        day_offset := group_idx / 2; -- Spread groups over multiple days
        
        -- Match Day 1: Position 1 vs Position 2
        INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
        SELECT 
            match_num, group_stage_id, g.id,
            gt1.team_id, gt2.team_id,
            venue_ids[((match_num - 1) % array_length(venue_ids, 1)) + 1],
            (base_date + (day_offset * 2) + 0)::timestamp + INTERVAL '18 hours',
            'scheduled', false
        FROM groups g
        JOIN group_teams gt1 ON g.id = gt1.group_id AND gt1.position = 1
        JOIN group_teams gt2 ON g.id = gt2.group_id AND gt2.position = 2
        WHERE g.group_name = group_letter
        LIMIT 1
        ON CONFLICT DO NOTHING;
        
        match_num := match_num + 1;

        -- Match Day 1: Position 3 vs Position 4
        INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
        SELECT 
            match_num, group_stage_id, g.id,
            gt3.team_id, gt4.team_id,
            venue_ids[((match_num - 1) % array_length(venue_ids, 1)) + 1],
            (base_date + (day_offset * 2) + 0)::timestamp + INTERVAL '22 hours',
            'scheduled', false
        FROM groups g
        JOIN group_teams gt3 ON g.id = gt3.group_id AND gt3.position = 3
        JOIN group_teams gt4 ON g.id = gt4.group_id AND gt4.position = 4
        WHERE g.group_name = group_letter
        LIMIT 1
        ON CONFLICT DO NOTHING;
        
        match_num := match_num + 1;

        -- Match Day 2: Position 1 vs Position 3
        INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
        SELECT 
            match_num, group_stage_id, g.id,
            gt1.team_id, gt3.team_id,
            venue_ids[((match_num - 1) % array_length(venue_ids, 1)) + 1],
            (base_date + (day_offset * 2) + 4)::timestamp + INTERVAL '18 hours',
            'scheduled', false
        FROM groups g
        JOIN group_teams gt1 ON g.id = gt1.group_id AND gt1.position = 1
        JOIN group_teams gt3 ON g.id = gt3.group_id AND gt3.position = 3
        WHERE g.group_name = group_letter
        LIMIT 1
        ON CONFLICT DO NOTHING;
        
        match_num := match_num + 1;

        -- Match Day 2: Position 2 vs Position 4
        INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
        SELECT 
            match_num, group_stage_id, g.id,
            gt2.team_id, gt4.team_id,
            venue_ids[((match_num - 1) % array_length(venue_ids, 1)) + 1],
            (base_date + (day_offset * 2) + 4)::timestamp + INTERVAL '22 hours',
            'scheduled', false
        FROM groups g
        JOIN group_teams gt2 ON g.id = gt2.group_id AND gt2.position = 2
        JOIN group_teams gt4 ON g.id = gt4.group_id AND gt4.position = 4
        WHERE g.group_name = group_letter
        LIMIT 1
        ON CONFLICT DO NOTHING;
        
        match_num := match_num + 1;

        -- Match Day 3: Position 1 vs Position 4
        INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
        SELECT 
            match_num, group_stage_id, g.id,
            gt1.team_id, gt4.team_id,
            venue_ids[((match_num - 1) % array_length(venue_ids, 1)) + 1],
            (base_date + (day_offset * 2) + 8)::timestamp + INTERVAL '18 hours',
            'scheduled', false
        FROM groups g
        JOIN group_teams gt1 ON g.id = gt1.group_id AND gt1.position = 1
        JOIN group_teams gt4 ON g.id = gt4.group_id AND gt4.position = 4
        WHERE g.group_name = group_letter
        LIMIT 1
        ON CONFLICT DO NOTHING;
        
        match_num := match_num + 1;

        -- Match Day 3: Position 2 vs Position 3
        INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
        SELECT 
            match_num, group_stage_id, g.id,
            gt2.team_id, gt3.team_id,
            venue_ids[((match_num - 1) % array_length(venue_ids, 1)) + 1],
            (base_date + (day_offset * 2) + 8)::timestamp + INTERVAL '22 hours',
            'scheduled', false
        FROM groups g
        JOIN group_teams gt2 ON g.id = gt2.group_id AND gt2.position = 2
        JOIN group_teams gt3 ON g.id = gt3.group_id AND gt3.position = 3
        WHERE g.group_name = group_letter
        LIMIT 1
        ON CONFLICT DO NOTHING;
        
        match_num := match_num + 1;
        group_idx := group_idx + 1;
    END LOOP;

END $$;

-- ============================================
-- NOTES:
-- ============================================
-- This script generates all 72 group stage matches (12 groups × 6 matches)
-- 
-- Match Pattern (standard World Cup format):
-- Match Day 1: Position 1 vs 2, Position 3 vs 4
-- Match Day 2: Position 1 vs 3, Position 2 vs 4  
-- Match Day 3: Position 1 vs 4, Position 2 vs 3
--
-- Dates are automatically distributed:
-- - Groups A-D: Start June 11-17
-- - Groups E-H: Start June 18-24
-- - Groups I-L: Start June 25-27 (if needed)
--
-- Update match_date values with official schedule once released.
-- Venues are distributed across all available venues.
