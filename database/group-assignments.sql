-- Group Team Assignments for 2026 FIFA World Cup
-- This assigns teams to their respective groups (A through L)
-- Note: Actual assignments will be confirmed after the official draw

-- ============================================
-- GROUP A TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'US' THEN 1
        WHEN 'MX' THEN 2
        WHEN 'BR' THEN 3
        WHEN 'FR' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'A'
  AND t.country_code IN ('US', 'MX', 'BR', 'FR')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP B TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'CA' THEN 1
        WHEN 'AR' THEN 2
        WHEN 'ES' THEN 3
        WHEN 'DE' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'B'
  AND t.country_code IN ('CA', 'AR', 'ES', 'DE')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP C TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'IT' THEN 1
        WHEN 'NL' THEN 2
        WHEN 'PT' THEN 3
        WHEN 'JP' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'C'
  AND t.country_code IN ('IT', 'NL', 'PT', 'JP')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP D TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'GB' THEN 1
        WHEN 'BE' THEN 2
        WHEN 'UY' THEN 3
        WHEN 'KR' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'D'
  AND t.country_code IN ('GB', 'BE', 'UY', 'KR')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP E TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'CL' THEN 1
        WHEN 'CO' THEN 2
        WHEN 'HR' THEN 3
        WHEN 'SA' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'E'
  AND t.country_code IN ('CL', 'CO', 'HR', 'SA')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP F TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'EC' THEN 1
        WHEN 'DK' THEN 2
        WHEN 'AU' THEN 3
        WHEN 'SN' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'F'
  AND t.country_code IN ('EC', 'DK', 'AU', 'SN')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP G TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'PY' THEN 1
        WHEN 'AT' THEN 2
        WHEN 'MA' THEN 3
        WHEN 'IR' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'G'
  AND t.country_code IN ('PY', 'AT', 'MA', 'IR')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP H TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'PE' THEN 1
        WHEN 'CH' THEN 2
        WHEN 'EG' THEN 3
        WHEN 'QA' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'H'
  AND t.country_code IN ('PE', 'CH', 'EG', 'QA')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP I TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'JM' THEN 1
        WHEN 'CZ' THEN 2
        WHEN 'NG' THEN 3
        WHEN 'AE' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'I'
  AND t.country_code IN ('JM', 'CZ', 'NG', 'AE')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP J TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'CR' THEN 1
        WHEN 'SE' THEN 2
        WHEN 'GH' THEN 3
        WHEN 'IQ' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'J'
  AND t.country_code IN ('CR', 'SE', 'GH', 'IQ')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP K TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'NO' THEN 1
        WHEN 'TN' THEN 2
        WHEN 'TH' THEN 3
        WHEN 'NZ' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'K'
  AND t.country_code IN ('NO', 'TN', 'TH', 'NZ')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- ============================================
-- GROUP L TEAMS
-- ============================================
INSERT INTO group_teams (group_id, team_id, position)
SELECT g.id, t.id, 
    CASE t.country_code 
        WHEN 'FI' THEN 1
        WHEN 'CI' THEN 2
        WHEN 'CN' THEN 3
        WHEN 'TR' THEN 4
    END as position
FROM groups g
CROSS JOIN teams t
WHERE g.group_name = 'L'
  AND t.country_code IN ('FI', 'CI', 'CN', 'TR')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- Note: These are example group assignments. Update with actual team assignments
-- once the official draw is complete. You can update using:
-- UPDATE group_teams SET position = X, team_id = (SELECT id FROM teams WHERE country_code = 'XX')
-- WHERE group_id = (SELECT id FROM groups WHERE group_name = 'X');
