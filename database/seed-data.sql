-- Seed Data for 2026 FIFA World Cup
-- Based on Wikipedia: https://en.wikipedia.org/wiki/2026_FIFA_World_Cup

-- ============================================
-- TOURNAMENT STAGES
-- ============================================
INSERT INTO tournament_stages (stage_name, stage_order, is_knockout) VALUES
('Group Stage', 1, false),
('Round of 32', 2, true),
('Round of 16', 3, true),
('Quarter Finals', 4, true),
('Semi Finals', 5, true),
('Third Place', 6, true),
('Final', 7, true)
ON CONFLICT (stage_name) DO NOTHING;

-- ============================================
-- GROUPS (A through L)
-- ============================================
DO $$
DECLARE
    group_stage_id UUID;
BEGIN
    SELECT id INTO group_stage_id FROM tournament_stages WHERE stage_name = 'Group Stage';
    
    INSERT INTO groups (group_name, tournament_stage_id) VALUES
    ('A', group_stage_id),
    ('B', group_stage_id),
    ('C', group_stage_id),
    ('D', group_stage_id),
    ('E', group_stage_id),
    ('F', group_stage_id),
    ('G', group_stage_id),
    ('H', group_stage_id),
    ('I', group_stage_id),
    ('J', group_stage_id),
    ('K', group_stage_id),
    ('L', group_stage_id)
    ON CONFLICT (group_name) DO NOTHING;
END $$;

-- ============================================
-- VENUES (16 host cities)
-- ============================================
INSERT INTO venues (name, city, country, capacity) VALUES
-- United States Venues
('MetLife Stadium', 'East Rutherford', 'United States', 82500),
('Lincoln Financial Field', 'Philadelphia', 'United States', 69596),
('AT&T Stadium', 'Arlington', 'United States', 80000),
('Gillette Stadium', 'Foxborough', 'United States', 65878),
('Arrowhead Stadium', 'Kansas City', 'United States', 76416),
('Hard Rock Stadium', 'Miami Gardens', 'United States', 65326),
('Mercedes-Benz Stadium', 'Atlanta', 'United States', 71000),
('NRG Stadium', 'Houston', 'United States', 72220),
('Levi''s Stadium', 'Santa Clara', 'United States', 68500),
('Lumen Field', 'Seattle', 'United States', 68740),
('SoFi Stadium', 'Inglewood', 'United States', 70240),
-- Canada Venues
('BC Place', 'Vancouver', 'Canada', 54500),
('BMO Field', 'Toronto', 'Canada', 30000),
-- Mexico Venues
('Estadio Azteca', 'Mexico City', 'Mexico', 87523),
('Estadio BBVA', 'Guadalajara', 'Mexico', 53460),
('Estadio Akron', 'Monterrey', 'Mexico', 53460)
ON CONFLICT DO NOTHING;

-- ============================================
-- TEAMS (48 participating teams)
-- Note: Some teams may not be confirmed yet. This includes known qualified teams.
-- ============================================
INSERT INTO teams (country_code, country_name, confederation) VALUES
-- Hosts
('US', 'United States', 'CONCACAF'),
('CA', 'Canada', 'CONCACAF'),
('MX', 'Mexico', 'CONCACAF'),
-- CONCACAF (additional)
('JM', 'Jamaica', 'CONCACAF'),
('CR', 'Costa Rica', 'CONCACAF'),
('HT', 'Haiti', 'CONCACAF'),
('PA', 'Panama', 'CONCACAF'),
('CW', 'Curaçao', 'CONCACAF'),
-- CONMEBOL
('BR', 'Brazil', 'CONMEBOL'),
('AR', 'Argentina', 'CONMEBOL'),
('UY', 'Uruguay', 'CONMEBOL'),
('CL', 'Chile', 'CONMEBOL'),
('CO', 'Colombia', 'CONMEBOL'),
('EC', 'Ecuador', 'CONMEBOL'),
('PY', 'Paraguay', 'CONMEBOL'),
('PE', 'Peru', 'CONMEBOL'),
-- UEFA
('FR', 'France', 'UEFA'),
('DE', 'Germany', 'UEFA'),
('ES', 'Spain', 'UEFA'),
('IT', 'Italy', 'UEFA'),
('NL', 'Netherlands', 'UEFA'),
('BE', 'Belgium', 'UEFA'),
('PT', 'Portugal', 'UEFA'),
('GB', 'England', 'UEFA'),
('SC', 'Scotland', 'UEFA'),
('PL', 'Poland', 'UEFA'),
('HR', 'Croatia', 'UEFA'),
('DK', 'Denmark', 'UEFA'),
('AT', 'Austria', 'UEFA'),
('CH', 'Switzerland', 'UEFA'),
('CZ', 'Czech Republic', 'UEFA'),
('SE', 'Sweden', 'UEFA'),
('NO', 'Norway', 'UEFA'),
('TR', 'Turkey', 'UEFA'),
('UA', 'Ukraine', 'UEFA'),
('RS', 'Serbia', 'UEFA'),
('GR', 'Greece', 'UEFA'),
('HU', 'Hungary', 'UEFA'),
('RO', 'Romania', 'UEFA'),
('IE', 'Ireland', 'UEFA'),
('IS', 'Iceland', 'UEFA'),
('SK', 'Slovakia', 'UEFA'),
('FI', 'Finland', 'UEFA'),
('BG', 'Bulgaria', 'UEFA'),
('AL', 'Albania', 'UEFA'),
('MK', 'North Macedonia', 'UEFA'),
('BA', 'Bosnia and Herzegovina', 'UEFA'),
('SI', 'Slovenia', 'UEFA'),
-- AFC (Asia)
('JP', 'Japan', 'AFC'),
('KR', 'South Korea', 'AFC'),
('SA', 'Saudi Arabia', 'AFC'),
('AU', 'Australia', 'AFC'),
('IR', 'Iran', 'AFC'),
('QA', 'Qatar', 'AFC'),
('AE', 'United Arab Emirates', 'AFC'),
('IQ', 'Iraq', 'AFC'),
('CN', 'China', 'AFC'),
('TH', 'Thailand', 'AFC'),
('JO', 'Jordan', 'AFC'),
('UZ', 'Uzbekistan', 'AFC'),
-- CAF (Africa)
('SN', 'Senegal', 'CAF'),
('MA', 'Morocco', 'CAF'),
('EG', 'Egypt', 'CAF'),
('NG', 'Nigeria', 'CAF'),
('GH', 'Ghana', 'CAF'),
('TN', 'Tunisia', 'CAF'),
('CI', 'Ivory Coast', 'CAF'),
('DZ', 'Algeria', 'CAF'),
('CM', 'Cameroon', 'CAF'),
('ZA', 'South Africa', 'CAF'),
('CV', 'Cape Verde', 'CAF'),
-- OFC (Oceania)
('NZ', 'New Zealand', 'OFC')
ON CONFLICT (country_code) DO NOTHING;

-- Note: The actual group assignments and all teams will be confirmed after the draw.
-- You can update group_teams table once the draw is complete.
