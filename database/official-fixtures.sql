-- Official 2026 FIFA World Cup Fixtures
-- Source: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures
-- Match numbering follows FIFA's official numbering system
-- Note: Some teams are placeholders for playoff winners - these can be updated once confirmed

-- ============================================
-- ADD PLACEHOLDER TEAMS FOR PLAYOFF WINNERS
-- ============================================
INSERT INTO teams (country_code, country_name, confederation) VALUES
-- UEFA Playoff winners (to be confirmed)
('TBD_UEFA_A', 'TBD (UEFA Playoff Path A)', 'UEFA'),
('TBD_UEFA_B', 'TBD (UEFA Playoff Path B)', 'UEFA'),
('TBD_UEFA_C', 'TBD (UEFA Playoff Path C)', 'UEFA'),
('TBD_UEFA_D', 'TBD (UEFA Playoff Path D)', 'UEFA'),
('TBD_IC_2', 'TBD (Intercontinental Playoff Path 2)', 'TBD'),
('TBD_PLAYOFF_1', 'TBD (Playoff Winner 1)', 'TBD'),
-- Additional placeholders as needed
('TBD_CAF', 'TBD (CAF Playoff)', 'CAF'),
('TBD_AFC', 'TBD (AFC Playoff)', 'AFC'),
('TBD_CONCACAF', 'TBD (CONCACAF Playoff)', 'CONCACAF')
ON CONFLICT (country_code) DO NOTHING;

-- ============================================
-- GROUP A FIXTURES
-- ============================================
-- Match 1: Mexico vs South Africa (Opening Match)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    1, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-11 18:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'A'
  AND t1.country_code = 'MX'
  AND t2.country_code = 'ZA'
  AND v.city = 'Mexico City'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 2: South Korea vs TBD (UEFA Playoff D)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    2, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-11 21:00:00-06'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'A'
  AND t1.country_code = 'KR'
  AND t2.country_code = 'TBD_UEFA_D'
  AND v.city = 'Guadalajara'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 25: TBD (UEFA Playoff D) vs South Africa
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    25, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-18 18:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'A'
  AND t1.country_code = 'TBD_UEFA_D'
  AND t2.country_code = 'ZA'
  AND v.city = 'Atlanta'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 28: Mexico vs South Korea
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    28, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-18 21:00:00-06'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'A'
  AND t1.country_code = 'MX'
  AND t2.country_code = 'KR'
  AND v.city = 'Guadalajara'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 53: TBD (UEFA Playoff D) vs Mexico
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    53, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-24 18:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'A'
  AND t1.country_code = 'TBD_UEFA_D'
  AND t2.country_code = 'MX'
  AND v.city = 'Mexico City'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 54: South Africa vs South Korea
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    54, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-24 18:00:00-06'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'A'
  AND t1.country_code = 'ZA'
  AND t2.country_code = 'KR'
  AND v.city = 'Monterrey'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP B FIXTURES
-- ============================================
-- Match 3: Canada vs TBD (UEFA Playoff A)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    3, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-12 18:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'B'
  AND t1.country_code = 'CA'
  AND t2.country_code = 'TBD_UEFA_A'
  AND v.city = 'Toronto'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 8: Qatar vs Switzerland
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    8, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-13 20:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'B'
  AND t1.country_code = 'QA'
  AND t2.country_code = 'CH'
  AND v.city = 'Santa Clara'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 26: Switzerland vs TBD (UEFA Playoff A)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    26, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-18 19:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'B'
  AND t1.country_code = 'CH'
  AND t2.country_code = 'TBD_UEFA_A'
  AND v.city = 'Inglewood'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 27: Canada vs Qatar
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    27, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-18 18:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'B'
  AND t1.country_code = 'CA'
  AND t2.country_code = 'QA'
  AND v.city = 'Vancouver'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 51: Switzerland vs Canada
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    51, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-24 18:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'B'
  AND t1.country_code = 'CH'
  AND t2.country_code = 'CA'
  AND v.city = 'Vancouver'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 52: TBD (UEFA Playoff A) vs Qatar
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    52, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-24 18:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'B'
  AND t1.country_code = 'TBD_UEFA_A'
  AND t2.country_code = 'QA'
  AND v.city = 'Seattle'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP C FIXTURES
-- ============================================
-- Match 5: Brazil vs Morocco
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    5, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-13 18:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'C'
  AND t1.country_code = 'BR'
  AND t2.country_code = 'MA'
  AND v.city = 'Foxborough'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 7: Haiti vs Scotland
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    7, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-13 21:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'C'
  AND t1.country_code = 'HT'
  AND t2.country_code = 'SC' -- Scotland
  AND v.city = 'East Rutherford'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 29: Brazil vs Haiti
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    29, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-19 21:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'C'
  AND t1.country_code = 'BR'
  AND t2.country_code = 'HT'
  AND v.city = 'Philadelphia'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 30: Scotland vs Morocco
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    30, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-19 18:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'C'
  AND t1.country_code = 'SC' -- Scotland
  AND t2.country_code = 'MA'
  AND v.city = 'Foxborough'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 49: Scotland vs Brazil
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    49, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-24 18:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'C'
  AND t1.country_code = 'SC' -- Scotland
  AND t2.country_code = 'BR'
  AND v.city = 'Miami Gardens'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 50: Morocco vs Haiti
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    50, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-24 18:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'C'
  AND t1.country_code = 'MA'
  AND t2.country_code = 'HT'
  AND v.city = 'Atlanta'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP D FIXTURES
-- ============================================
-- Match 4: USA vs Paraguay
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    4, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-12 21:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'D'
  AND t1.country_code = 'US'
  AND t2.country_code = 'PY'
  AND v.city = 'Inglewood'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 6: Australia vs TBD (UEFA Playoff C)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    6, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-13 00:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'D'
  AND t1.country_code = 'AU'
  AND t2.country_code = 'TBD_UEFA_C'
  AND v.city = 'Vancouver'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 31: USA vs Australia
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    31, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-19 15:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'D'
  AND t1.country_code = 'US'
  AND t2.country_code = 'AU'
  AND v.city = 'Seattle'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 32: TBD (UEFA Playoff C) vs Paraguay
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    32, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-19 00:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'D'
  AND t1.country_code = 'TBD_UEFA_C'
  AND t2.country_code = 'PY'
  AND v.city = 'Santa Clara'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 55: Paraguay vs Australia
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    55, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-25 22:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'D'
  AND t1.country_code = 'PY'
  AND t2.country_code = 'AU'
  AND v.city = 'Santa Clara'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 56: TBD (UEFA Playoff C) vs USA
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    56, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-25 22:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'D'
  AND t1.country_code = 'TBD_UEFA_C'
  AND t2.country_code = 'US'
  AND v.city = 'Inglewood'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP E FIXTURES
-- ============================================
-- Match 9: Ivory Coast vs Ecuador
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    9, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-14 19:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'E'
  AND t1.country_code = 'CI'
  AND t2.country_code = 'EC'
  AND v.city = 'Philadelphia'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 10: Germany vs Curaçao
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    10, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-14 12:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'E'
  AND t1.country_code = 'DE'
  AND t2.country_code = 'CW'
  AND v.city = 'Houston'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 33: Germany vs Ivory Coast
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    33, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-20 16:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'E'
  AND t1.country_code = 'DE'
  AND t2.country_code = 'CI'
  AND v.city = 'Toronto'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 34: Ecuador vs Curaçao
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    34, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-20 19:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'E'
  AND t1.country_code = 'EC'
  AND t2.country_code = 'CW'
  AND v.city = 'Kansas City'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 57: Curaçao vs Ivory Coast
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    57, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-25 16:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'E'
  AND t1.country_code = 'CW'
  AND t2.country_code = 'CI'
  AND v.city = 'Philadelphia'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 58: Ecuador vs Germany
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    58, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-25 16:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'E'
  AND t1.country_code = 'EC'
  AND t2.country_code = 'DE'
  AND v.city = 'East Rutherford'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP F FIXTURES
-- ============================================
-- Match 11: Netherlands vs Japan
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    11, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-14 15:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'F'
  AND t1.country_code = 'NL'
  AND t2.country_code = 'JP'
  AND v.city = 'Arlington'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 12: Tunisia vs TBD (UEFA Playoff B)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    12, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-14 22:00:00-06'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'F'
  AND t1.country_code = 'TN'
  AND t2.country_code = 'TBD_UEFA_B'
  AND v.city = 'Monterrey'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 35: Netherlands vs TBD (UEFA Playoff B)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    35, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-20 12:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'F'
  AND t1.country_code = 'NL'
  AND t2.country_code = 'TBD_UEFA_B'
  AND v.city = 'Houston'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 36: Tunisia vs Japan
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    36, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-20 22:00:00-06'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'F'
  AND t1.country_code = 'TN'
  AND t2.country_code = 'JP'
  AND v.city = 'Monterrey'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 59: Japan vs TBD (UEFA Playoff B)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    59, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-25 18:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'F'
  AND t1.country_code = 'JP'
  AND t2.country_code = 'TBD_UEFA_B'
  AND v.city = 'Arlington'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 60: Tunisia vs Netherlands
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    60, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-25 18:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'F'
  AND t1.country_code = 'TN'
  AND t2.country_code = 'NL'
  AND v.city = 'Kansas City'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP G FIXTURES
-- ============================================
-- Match 15: Iran vs New Zealand
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    15, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-15 18:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'G'
  AND t1.country_code = 'IR'
  AND t2.country_code = 'NZ'
  AND v.city = 'Inglewood'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 16: Belgium vs Egypt
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    16, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-15 15:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'G'
  AND t1.country_code = 'BE'
  AND t2.country_code = 'EG'
  AND v.city = 'Seattle'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 39: Belgium vs Iran
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    39, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-21 15:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'G'
  AND t1.country_code = 'BE'
  AND t2.country_code = 'IR'
  AND v.city = 'Inglewood'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 40: New Zealand vs Egypt
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    40, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-21 18:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'G'
  AND t1.country_code = 'NZ'
  AND t2.country_code = 'EG'
  AND v.city = 'Vancouver'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 63: Egypt vs Iran
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    63, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-26 20:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'G'
  AND t1.country_code = 'EG'
  AND t2.country_code = 'IR'
  AND v.city = 'Seattle'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 64: New Zealand vs Belgium
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    64, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-26 20:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'G'
  AND t1.country_code = 'NZ'
  AND t2.country_code = 'BE'
  AND v.city = 'Vancouver'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP H FIXTURES
-- ============================================
-- Match 13: Spain vs Cape Verde
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    13, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-15 15:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'H'
  AND t1.country_code = 'ES'
  AND t2.country_code = 'CV'
  AND v.city = 'Atlanta'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 14: Saudi Arabia vs Uruguay
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    14, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-15 18:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'H'
  AND t1.country_code = 'SA'
  AND t2.country_code = 'UY'
  AND v.city = 'Miami Gardens'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 37: Uruguay vs Cape Verde
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    37, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-21 18:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'H'
  AND t1.country_code = 'UY'
  AND t2.country_code = 'CV'
  AND v.city = 'Miami Gardens'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 38: Spain vs Saudi Arabia
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    38, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-21 15:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'H'
  AND t1.country_code = 'ES'
  AND t2.country_code = 'SA'
  AND v.city = 'Atlanta'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 65: Cape Verde vs Saudi Arabia
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    65, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-26 19:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'H'
  AND t1.country_code = 'CV'
  AND t2.country_code = 'SA'
  AND v.city = 'Houston'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 66: Uruguay vs Spain
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    66, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-26 18:00:00-06'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'H'
  AND t1.country_code = 'UY'
  AND t2.country_code = 'ES'
  AND v.city = 'Guadalajara'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP I FIXTURES
-- ============================================
-- Match 17: France vs Senegal
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    17, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-16 15:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'I'
  AND t1.country_code = 'FR'
  AND t2.country_code = 'SN'
  AND v.city = 'East Rutherford'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 18: TBD (IC Path 2) vs Norway
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    18, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-16 18:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'I'
  AND t1.country_code = 'TBD_IC_2'
  AND t2.country_code = 'NO'
  AND v.city = 'Foxborough'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 41: Norway vs Senegal
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    41, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-22 20:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'I'
  AND t1.country_code = 'NO'
  AND t2.country_code = 'SN'
  AND v.city = 'East Rutherford'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 42: France vs TBD (IC Path 2)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    42, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-22 17:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'I'
  AND t1.country_code = 'FR'
  AND t2.country_code = 'TBD_IC_2'
  AND v.city = 'Philadelphia'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 61: Senegal vs TBD (IC Path 2)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    61, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-26 15:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'I'
  AND t1.country_code = 'SN'
  AND t2.country_code = 'TBD_IC_2'
  AND v.city = 'Foxborough'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 62: Norway vs France
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    62, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-26 15:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'I'
  AND t1.country_code = 'NO'
  AND t2.country_code = 'FR'
  AND v.city = 'Toronto'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP J FIXTURES
-- ============================================
-- Match 19: Argentina vs Algeria
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    19, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-16 21:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'J'
  AND t1.country_code = 'AR'
  AND t2.country_code = 'DZ'
  AND v.city = 'Kansas City'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 20: Austria vs Jordan
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    20, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-17 00:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'J'
  AND t1.country_code = 'AT'
  AND t2.country_code = 'JO'
  AND v.city = 'Santa Clara'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 43: Argentina vs Austria
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    43, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-22 13:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'J'
  AND t1.country_code = 'AR'
  AND t2.country_code = 'AT'
  AND v.city = 'Arlington'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 44: Jordan vs Algeria
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    44, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-22 23:00:00-07'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'J'
  AND t1.country_code = 'JO'
  AND t2.country_code = 'DZ'
  AND v.city = 'Santa Clara'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 69: Algeria vs Austria
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    69, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-27 22:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'J'
  AND t1.country_code = 'DZ'
  AND t2.country_code = 'AT'
  AND v.city = 'Kansas City'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 70: Jordan vs Argentina
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    70, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-27 22:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'J'
  AND t1.country_code = 'JO'
  AND t2.country_code = 'AR'
  AND v.city = 'Arlington'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP K FIXTURES
-- ============================================
-- Match 23: Portugal vs TBD (Playoff Winner 1)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    23, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-17 13:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'K'
  AND t1.country_code = 'PT'
  AND t2.country_code = 'TBD_PLAYOFF_1'
  AND v.city = 'Houston'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 24: Uzbekistan vs Colombia
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    24, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-17 22:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'K'
  AND t1.country_code = 'UZ'
  AND t2.country_code = 'CO'
  AND v.city = 'Mexico City'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 47: Portugal vs Uzbekistan
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    47, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-23 13:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'K'
  AND t1.country_code = 'PT'
  AND t2.country_code = 'UZ'
  AND v.city = 'Houston'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 48: Colombia vs TBD (Playoff Winner 1)
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    48, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-23 22:00:00-06'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'K'
  AND t1.country_code = 'CO'
  AND t2.country_code = 'TBD_PLAYOFF_1'
  AND v.city = 'Guadalajara'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 71: Colombia vs Portugal
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    71, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-27 19:30:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'K'
  AND t1.country_code = 'CO'
  AND t2.country_code = 'PT'
  AND v.city = 'Miami Gardens'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 72: TBD (Playoff Winner 1) vs Uzbekistan
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    72, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-27 19:30:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'K'
  AND t1.country_code = 'TBD_PLAYOFF_1'
  AND t2.country_code = 'UZ'
  AND v.city = 'Atlanta'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP L FIXTURES
-- ============================================
-- Match 21: England vs Croatia
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    21, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-17 16:00:00-05'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'L'
  AND t1.country_code = 'GB'
  AND t2.country_code = 'HR'
  AND v.city = 'Arlington'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 22: Ghana vs Panama
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    22, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-17 15:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'L'
  AND t1.country_code = 'GH'
  AND t2.country_code = 'PA'
  AND v.city = 'Toronto'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 45: England vs Ghana
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    45, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-23 16:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'L'
  AND t1.country_code = 'GB'
  AND t2.country_code = 'GH'
  AND v.city = 'Foxborough'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 46: Panama vs Croatia
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    46, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-23 16:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'L'
  AND t1.country_code = 'PA'
  AND t2.country_code = 'HR'
  AND v.city = 'Toronto'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 67: Panama vs England
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    67, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-27 15:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'L'
  AND t1.country_code = 'PA'
  AND t2.country_code = 'GB'
  AND v.city = 'East Rutherford'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Match 68: Croatia vs Ghana
INSERT INTO matches (match_number, tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, status, is_knockout)
SELECT 
    68, ts.id, g.id,
    t1.id, t2.id, v.id,
    '2026-06-27 15:00:00-04'::timestamptz, 'scheduled', false
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'L'
  AND t1.country_code = 'HR'
  AND t2.country_code = 'GH'
  AND v.city = 'Philadelphia'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTES:
-- ============================================
-- To update placeholder teams once playoff winners are known, use:
-- UPDATE teams SET country_code = 'XX', country_name = 'Country Name' 
-- WHERE country_code = 'TBD_UEFA_A' (or C, D, etc.);
--
-- Then update matches that reference the placeholder:
-- UPDATE matches SET home_team_id = (SELECT id FROM teams WHERE country_code = 'XX')
-- WHERE home_team_id = (SELECT id FROM teams WHERE country_code = 'TBD_UEFA_A');
--
-- UPDATE matches SET away_team_id = (SELECT id FROM teams WHERE country_code = 'XX')
-- WHERE away_team_id = (SELECT id FROM teams WHERE country_code = 'TBD_UEFA_A');
