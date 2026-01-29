# 2026 FIFA World Cup Database Schema

This directory contains SQL scripts to set up the database for the World Cup 2026 Predictor app on Supabase.

## Files

- **schema.sql** - Main database schema with all tables, indexes, and RLS policies
- **seed-data.sql** - Initial seed data including stages, groups, venues, and teams
- **group-assignments.sql** - Assigns teams to their respective groups (A through L)
- **all-group-stage-matches.sql** - Generates all 72 group stage matches (6 matches × 12 groups)
- **matches.sql** - Legacy file with example matches (can be replaced by all-group-stage-matches.sql)

## Setup Instructions

### 1. Run Schema in Supabase

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `schema.sql`
5. Click **Run** to execute

### 2. Seed Initial Data

1. In the **SQL Editor**, create another new query
2. Copy and paste the contents of `seed-data.sql`
3. Click **Run** to execute

### 3. Assign Teams to Groups

1. In the **SQL Editor**, create another new query
2. Copy and paste the contents of `group-assignments.sql`
3. Click **Run** to execute

### 4. Generate All Group Stage Matches

1. In the **SQL Editor**, create another new query
2. Copy and paste the contents of `all-group-stage-matches.sql`
3. Click **Run** to execute

**Note**: This will generate all 72 group stage matches (6 matches per group × 12 groups). The script automatically creates matches based on the teams assigned in each group from `group-assignments.sql`. Update match dates with the official schedule once it's released.

## Database Structure

### Core Tables

- **teams** - All 48 participating countries
- **tournament_stages** - Stages of the tournament (Group Stage, R32, R16, QF, SF, Final)
- **groups** - 12 groups (A through L) for the group stage
- **group_teams** - Teams assigned to each group with standings
- **matches** - Individual matches with scores and status
- **venues** - 16 host stadiums across USA, Canada, and Mexico

### User Data Tables

- **user_profiles** - User profile information including username
- **predictions** - User predictions (ante post and live)
- **user_points** - User points summary and statistics
- **competitions** - User-created competitions
- **competition_participants** - Users participating in competitions

## Important Notes

1. **Group Assignments**: The actual team assignments to groups will be determined after the draw. You'll need to insert data into `group_teams` once the draw is complete.

2. **Match Schedule**: Match dates and times will need to be added to the `matches` table once the official schedule is released.

3. **Team List**: Some teams in `seed-data.sql` are placeholders based on typical qualifiers. Update the teams list once qualification is complete.

4. **Row Level Security (RLS)**: RLS is enabled on user-specific tables. Public tables (teams, matches, groups) are readable by all authenticated users.

## Updating Match Schedule

Once the official match schedule is released, you can insert matches like this:

```sql
INSERT INTO matches (tournament_stage_id, group_id, home_team_id, away_team_id, venue_id, match_date, match_number)
SELECT 
    ts.id,
    g.id,
    t1.id,
    t2.id,
    v.id,
    '2026-06-11 18:00:00+00'::timestamptz,
    1
FROM tournament_stages ts
CROSS JOIN groups g
CROSS JOIN teams t1
CROSS JOIN teams t2
CROSS JOIN venues v
WHERE ts.stage_name = 'Group Stage'
  AND g.group_name = 'A'
  AND t1.country_code = 'US'
  AND t2.country_code = 'MX'
  AND v.city = 'Mexico City'
LIMIT 1;
```

## References

- [2026 FIFA World Cup Wikipedia](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup)
