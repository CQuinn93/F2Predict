-- Diagnostic Script for Missing Matches
-- This script checks why matches 10, 13, 20, 22, 24, 29, 30, 37, 44, 46, 47, 49, 50, 57, 65, 67, 70, 72 are not in the database

-- ============================================
-- 1. CHECK IF TOURNAMENT STAGE EXISTS
-- ============================================
SELECT '1. Tournament Stages Check' as check_type;
SELECT id, stage_name, stage_order, is_knockout 
FROM tournament_stages 
WHERE stage_name = 'Group Stage';

-- ============================================
-- 2. CHECK IF GROUPS EXIST
-- ============================================
SELECT '2. Groups Check' as check_type;
SELECT g.id, g.group_name, g.tournament_stage_id
FROM groups g
WHERE g.group_name IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L')
ORDER BY g.group_name;

-- ============================================
-- 3. CHECK IF REQUIRED TEAMS EXIST
-- ============================================
SELECT '3. Required Teams Check' as check_type;
SELECT country_code, country_name, confederation
FROM teams
WHERE country_code IN (
    -- Teams from the missing matches
    'DE', 'CW',      -- Match 10
    'ES', 'CV',      -- Match 13
    'AT', 'JO',      -- Match 20
    'GH', 'PA',      -- Match 22
    'UZ', 'CO',      -- Match 24
    'BR', 'HT',      -- Match 29
    'SC', 'MA',      -- Match 30
    'UY', 'CV',      -- Match 37
    'JO', 'DZ',      -- Match 44
    'PA', 'HR',      -- Match 46
    'PT', 'UZ',      -- Match 47
    'SC', 'BR',      -- Match 49
    'MA', 'HT',      -- Match 50
    'CW', 'CI',      -- Match 57
    'CV', 'SA',      -- Match 65
    'PA', 'GB',      -- Match 67
    'JO', 'AR',      -- Match 70
    'TBD_PLAYOFF_1', 'UZ'  -- Match 72
)
ORDER BY country_code;

-- Check for missing teams
SELECT 'Missing Teams' as issue, 
       t.country_code
FROM (SELECT UNNEST(ARRAY['DE', 'CW', 'ES', 'CV', 'AT', 'JO', 'GH', 'PA', 'UZ', 'CO', 'BR', 'HT', 'SC', 'MA', 'UY', 'DZ', 'HR', 'PT', 'CI', 'SA', 'GB', 'AR', 'TBD_PLAYOFF_1']) as country_code) t
WHERE NOT EXISTS (
    SELECT 1 FROM teams 
    WHERE teams.country_code = t.country_code
);

-- ============================================
-- 4. CHECK IF REQUIRED VENUES EXIST
-- ============================================
SELECT '4. Required Venues Check' as check_type;
SELECT id, name, city, country
FROM venues
WHERE city IN (
    'Houston',      -- Match 10
    'Atlanta',      -- Match 13
    'Santa Clara',  -- Match 20
    'Toronto',      -- Match 22
    'Mexico City',  -- Match 24
    'Philadelphia', -- Match 29
    'Foxborough',   -- Match 30
    'Miami Gardens', -- Match 37
    'Guadalajara',  -- Match 44 (actually this might be wrong, check)
    'Toronto',      -- Match 46
    'Houston',      -- Match 47
    'Miami Gardens', -- Match 49
    'Atlanta',      -- Match 50
    'Philadelphia', -- Match 57
    'Houston',      -- Match 65
    'East Rutherford', -- Match 67
    'Arlington',    -- Match 70
    'Atlanta'       -- Match 72
)
ORDER BY city;

-- Check exact city names from venues table
SELECT 'All Venue Cities' as info, city, name
FROM venues
ORDER BY city;

-- ============================================
-- 5. CHECK WHICH MATCHES CURRENTLY EXIST
-- ============================================
SELECT '5. Existing Matches Check' as check_type;
SELECT match_number, 
       g.group_name,
       t1.country_code as home_team,
       t2.country_code as away_team,
       v.city as venue_city,
       match_date,
       status
FROM matches m
LEFT JOIN groups g ON m.group_id = g.id
LEFT JOIN teams t1 ON m.home_team_id = t1.id
LEFT JOIN teams t2 ON m.away_team_id = t2.id
LEFT JOIN venues v ON m.venue_id = v.id
WHERE match_number IN (10, 13, 20, 22, 24, 29, 30, 37, 44, 46, 47, 49, 50, 57, 65, 67, 70, 72)
ORDER BY match_number;

-- ============================================
-- 6. TEST QUERIES FOR EACH MISSING MATCH
-- ============================================
SELECT '6. Testing Match 10 (Germany vs Curaçao)' as test_match;

-- Match 10: Germany vs Curaçao in Houston
SELECT 
    ts.id as stage_id,
    g.id as group_id,
    t1.id as home_team_id,
    t1.country_code as home_team_code,
    t2.id as away_team_id,
    t2.country_code as away_team_code,
    v.id as venue_id,
    v.city as venue_city
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'E'
  AND t1.country_code = 'DE'
  AND t2.country_code = 'CW'
  AND v.city = 'Houston';

SELECT 'Testing Match 13 (Spain vs Cape Verde)' as test_match;

-- Match 13: Spain vs Cape Verde in Atlanta
SELECT 
    ts.id as stage_id,
    g.id as group_id,
    t1.id as home_team_id,
    t1.country_code as home_team_code,
    t2.id as away_team_id,
    t2.country_code as away_team_code,
    v.id as venue_id,
    v.city as venue_city
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'H'
  AND t1.country_code = 'ES'
  AND t2.country_code = 'CV'
  AND v.city = 'Atlanta';

SELECT 'Testing Match 20 (Austria vs Jordan)' as test_match;

-- Match 20: Austria vs Jordan in Santa Clara
SELECT 
    ts.id as stage_id,
    g.id as group_id,
    t1.id as home_team_id,
    t1.country_code as home_team_code,
    t2.id as away_team_id,
    t2.country_code as away_team_code,
    v.id as venue_id,
    v.city as venue_city
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'J'
  AND t1.country_code = 'AT'
  AND t2.country_code = 'JO'
  AND v.city = 'Santa Clara';

-- ============================================
-- 7. CHECK FOR MISSING DATA SUMMARY
-- ============================================
SELECT '7. Summary of Missing Data' as summary;

-- Missing teams
SELECT 'MISSING TEAM' as issue_type, 
       country_code as missing_item,
       'Team not found in teams table' as description
FROM (SELECT UNNEST(ARRAY['DE', 'CW', 'ES', 'CV', 'AT', 'JO', 'GH', 'PA', 'UZ', 'CO', 'BR', 'HT', 'SC', 'MA', 'UY', 'DZ', 'HR', 'PT', 'CI', 'SA', 'GB', 'AR', 'TBD_PLAYOFF_1']) as country_code) t
WHERE NOT EXISTS (
    SELECT 1 FROM teams WHERE teams.country_code = t.country_code
);

-- Missing venues (by city)
SELECT 'MISSING VENUE' as issue_type,
       city as missing_item,
       'Venue city not found in venues table' as description
FROM (SELECT UNNEST(ARRAY['Houston', 'Atlanta', 'Santa Clara', 'Toronto', 'Mexico City', 'Philadelphia', 'Foxborough', 'Miami Gardens', 'Guadalajara', 'East Rutherford', 'Arlington']) as city) v
WHERE NOT EXISTS (
    SELECT 1 FROM venues WHERE venues.city = v.city
);

-- ============================================
-- 8. CHECK FOR DUPLICATE MATCH NUMBERS
-- ============================================
SELECT '8. Duplicate Match Numbers Check' as check_type;
SELECT match_number, COUNT(*) as count
FROM matches
WHERE match_number IN (10, 13, 20, 22, 24, 29, 30, 37, 44, 46, 47, 49, 50, 57, 65, 67, 70, 72)
GROUP BY match_number
HAVING COUNT(*) > 1;

-- ============================================
-- 9. INDIVIDUAL MATCH VERIFICATION
-- ============================================
-- This checks each match number to see what data is available

-- Match 10: Germany vs Curaçao (Group E, Houston)
SELECT 'Match 10 Check' as match_check, 
       CASE WHEN ts.id IS NOT NULL THEN '✓ Stage exists' ELSE '✗ Stage missing' END as stage_check,
       CASE WHEN g.id IS NOT NULL THEN '✓ Group E exists' ELSE '✗ Group E missing' END as group_check,
       CASE WHEN t1.id IS NOT NULL THEN '✓ Germany (DE) exists' ELSE '✗ Germany missing' END as home_team_check,
       CASE WHEN t2.id IS NOT NULL THEN '✓ Curaçao (CW) exists' ELSE '✗ Curaçao missing' END as away_team_check,
       CASE WHEN v.id IS NOT NULL THEN '✓ Houston venue exists' ELSE '✗ Houston venue missing' END as venue_check
FROM tournament_stages ts
FULL OUTER JOIN groups g ON g.group_name = 'E' AND g.tournament_stage_id = ts.id
FULL OUTER JOIN teams t1 ON t1.country_code = 'DE'
FULL OUTER JOIN teams t2 ON t2.country_code = 'CW'
FULL OUTER JOIN venues v ON v.city = 'Houston'
WHERE ts.stage_name = 'Group Stage'
LIMIT 1;

-- Match 13: Spain vs Cape Verde (Group H, Atlanta)
SELECT 'Match 13 Check' as match_check,
       CASE WHEN ts.id IS NOT NULL THEN '✓ Stage exists' ELSE '✗ Stage missing' END as stage_check,
       CASE WHEN g.id IS NOT NULL THEN '✓ Group H exists' ELSE '✗ Group H missing' END as group_check,
       CASE WHEN t1.id IS NOT NULL THEN '✓ Spain (ES) exists' ELSE '✗ Spain missing' END as home_team_check,
       CASE WHEN t2.id IS NOT NULL THEN '✓ Cape Verde (CV) exists' ELSE '✗ Cape Verde missing' END as away_team_check,
       CASE WHEN v.id IS NOT NULL THEN '✓ Atlanta venue exists' ELSE '✗ Atlanta venue missing' END as venue_check
FROM tournament_stages ts
FULL OUTER JOIN groups g ON g.group_name = 'H' AND g.tournament_stage_id = ts.id
FULL OUTER JOIN teams t1 ON t1.country_code = 'ES'
FULL OUTER JOIN teams t2 ON t2.country_code = 'CV'
FULL OUTER JOIN venues v ON v.city = 'Atlanta'
WHERE ts.stage_name = 'Group Stage'
LIMIT 1;

-- ============================================
-- 10. COMPREHENSIVE MISSING DATA REPORT
-- ============================================
SELECT '10. Comprehensive Missing Data Report' as report;

-- Check all required teams exist
WITH required_teams AS (
    SELECT UNNEST(ARRAY['DE', 'CW', 'ES', 'CV', 'AT', 'JO', 'GH', 'PA', 'UZ', 'CO', 'BR', 'HT', 'SC', 'MA', 'UY', 'DZ', 'HR', 'PT', 'CI', 'SA', 'GB', 'AR', 'TBD_PLAYOFF_1']) as country_code
)
SELECT 'MISSING TEAM' as issue_type, rt.country_code as item, 'Team does not exist in teams table' as description
FROM required_teams rt
WHERE NOT EXISTS (SELECT 1 FROM teams WHERE teams.country_code = rt.country_code);

-- Check all required venues exist
WITH required_venues AS (
    SELECT UNNEST(ARRAY['Houston', 'Atlanta', 'Santa Clara', 'Toronto', 'Mexico City', 'Philadelphia', 'Foxborough', 'Miami Gardens', 'Guadalajara', 'East Rutherford', 'Arlington']) as city
)
SELECT 'MISSING VENUE' as issue_type, rv.city as item, 'Venue city does not exist in venues table' as description
FROM required_venues rv
WHERE NOT EXISTS (SELECT 1 FROM venues WHERE venues.city = rv.city);

-- Check all required groups exist
WITH required_groups AS (
    SELECT UNNEST(ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']) as group_name
)
SELECT 'MISSING GROUP' as issue_type, rg.group_name as item, 'Group does not exist in groups table' as description
FROM required_groups rg
WHERE NOT EXISTS (SELECT 1 FROM groups WHERE groups.group_name = rg.group_name);

-- ============================================
-- 11. CHECK FOR CONSTRAINT VIOLATIONS
-- ============================================
SELECT '11. Checking for Potential Constraint Issues' as check_type;

-- Check if match_number has a unique constraint
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'matches'::regclass
  AND conname LIKE '%match_number%';

-- Check total count of matches in database
SELECT 'Total matches in database' as info, COUNT(*) as count
FROM matches;

-- Check matches by status
SELECT 'Matches by status' as info, status, COUNT(*) as count
FROM matches
GROUP BY status;
