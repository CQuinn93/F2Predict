import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';

export interface Match {
  id: string;
  match_number: number;
  tournament_stage_id: string;
  group_id: string | null;
  home_team_id: string;
  away_team_id: string;
  venue_id: string;
  match_date: string;
  home_score: number | null;
  away_score: number | null;
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
  is_knockout: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  home_team?: Team;
  away_team?: Team;
  venue?: Venue;
  group?: Group;
  tournament_stage?: TournamentStage;
}

export interface Team {
  id: string;
  country_code: string;
  country_name: string;
  confederation: string;
  fifa_ranking?: number | null;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number | null;
}

export interface Group {
  id: string;
  group_name: string;
}

export interface TournamentStage {
  id: string;
  stage_name: string;
  stage_order: number;
  is_knockout: boolean;
}

const CACHE_KEY = 'fixtures_cache';
const CACHE_TIMESTAMP_KEY = 'fixtures_cache_timestamp';
const CACHE_VERSION_KEY = 'fixtures_cache_version';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

// Get cache expiry time (1 hour from now)
const getCacheExpiry = () => Date.now() + CACHE_EXPIRY_MS;

// Save fixtures to cache
const saveCache = async (fixtures: Match[], version?: string) => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fixtures));
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, getCacheExpiry().toString());
    if (version) {
      await AsyncStorage.setItem(CACHE_VERSION_KEY, version);
    }
  } catch (error) {
    console.error('Error saving fixtures cache:', error);
  }
};

// Load fixtures from cache
const loadCache = async (): Promise<Match[] | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    const cacheTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cachedData || !cacheTimestamp) {
      return null;
    }

    const expiryTime = parseInt(cacheTimestamp, 10);
    if (Date.now() > expiryTime) {
      // Cache expired
      await clearCache();
      return null;
    }

    return JSON.parse(cachedData);
  } catch (error) {
    console.error('Error loading fixtures cache:', error);
    return null;
  }
};

// Clear cache
const clearCache = async () => {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY);
    await AsyncStorage.removeItem(CACHE_VERSION_KEY);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Get database version/hash to check for changes
const getDatabaseVersion = async (): Promise<string | null> => {
  try {
    // Get the most recent updated_at timestamp from matches table
    const { data, error } = await supabase
      .from('matches')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error getting database version:', error);
      return null;
    }

    // If no matches exist yet, return null
    if (!data) {
      return null;
    }

    return data.updated_at || null;
  } catch (error) {
    console.error('Error getting database version:', error);
    return null;
  }
};

// Check if cache is still valid by comparing database version
const isCacheValid = async (): Promise<boolean> => {
  try {
    const cachedVersion = await AsyncStorage.getItem(CACHE_VERSION_KEY);
    const dbVersion = await getDatabaseVersion();

    if (!cachedVersion || !dbVersion) {
      return false;
    }

    // Compare versions - if different, cache is invalid
    return cachedVersion === dbVersion;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
};

// Fetch fixtures from database
const fetchFixturesFromDatabase = async (): Promise<Match[]> => {
  try {
    // First, get all matches with basic data
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: true })
      .order('match_number', { ascending: true });

    if (matchesError) {
      console.error('Error fetching matches:', matchesError);
      throw matchesError;
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Get all unique IDs for batch fetching
    const teamIds = new Set<string>();
    const venueIds = new Set<string>();
    const groupIds = new Set<string>();
    const stageIds = new Set<string>();

    matches.forEach((match) => {
      if (match.home_team_id) teamIds.add(match.home_team_id);
      if (match.away_team_id) teamIds.add(match.away_team_id);
      if (match.venue_id) venueIds.add(match.venue_id);
      if (match.group_id) groupIds.add(match.group_id);
      if (match.tournament_stage_id) stageIds.add(match.tournament_stage_id);
    });

    // Fetch related data in parallel
    // Include fifa_ranking in teams query so we don't need to query again later
    const [teamsResult, venuesResult, groupsResult, stagesResult] = await Promise.all([
      supabase.from('teams').select('id, country_code, country_name, confederation, fifa_ranking').in('id', Array.from(teamIds)),
      supabase.from('venues').select('id, name, city, country, capacity').in('id', Array.from(venueIds)),
      supabase.from('groups').select('id, group_name').in('id', Array.from(groupIds)),
      supabase.from('tournament_stages').select('id, stage_name, stage_order, is_knockout').in('id', Array.from(stageIds)),
    ]);

    // Create lookup maps
    const teamsMap = new Map((teamsResult.data || []).map((t) => [t.id, t]));
    const venuesMap = new Map((venuesResult.data || []).map((v) => [v.id, v]));
    const groupsMap = new Map((groupsResult.data || []).map((g) => [g.id, g]));
    const stagesMap = new Map((stagesResult.data || []).map((s) => [s.id, s]));

    // Combine data
    const enrichedMatches: Match[] = matches.map((match) => ({
      ...match,
      home_team: match.home_team_id ? teamsMap.get(match.home_team_id) : undefined,
      away_team: match.away_team_id ? teamsMap.get(match.away_team_id) : undefined,
      venue: match.venue_id ? venuesMap.get(match.venue_id) : undefined,
      group: match.group_id ? groupsMap.get(match.group_id) : undefined,
      tournament_stage: match.tournament_stage_id ? stagesMap.get(match.tournament_stage_id) : undefined,
    }));

    return enrichedMatches;
  } catch (error) {
    console.error('Error fetching fixtures from database:', error);
    throw error;
  }
};

// Main function to get fixtures with caching
export const getFixtures = async (forceRefresh: boolean = false): Promise<Match[]> => {
  try {
    // If not forcing refresh, check cache first
    if (!forceRefresh) {
      // Check if cache is valid by comparing database version
      const cacheValid = await isCacheValid();
      
      if (cacheValid) {
        const cachedFixtures = await loadCache();
        if (cachedFixtures && cachedFixtures.length > 0) {
          console.log('Returning cached fixtures');
          return cachedFixtures;
        }
      } else {
        // Cache is invalid, clear it
        await clearCache();
      }
    } else {
      // Force refresh - clear cache
      await clearCache();
    }

    // Fetch from database
    console.log('Fetching fixtures from database...');
    const fixtures = await fetchFixturesFromDatabase();

    // Get database version for cache validation
    const dbVersion = await getDatabaseVersion();

    // Save to cache
    await saveCache(fixtures, dbVersion || undefined);

    return fixtures;
  } catch (error) {
    console.error('Error getting fixtures:', error);
    
    // On error, try to return cached data if available
    const cachedFixtures = await loadCache();
    if (cachedFixtures && cachedFixtures.length > 0) {
      console.log('Database error, returning cached fixtures');
      return cachedFixtures;
    }

    throw error;
  }
};

// Get fixtures for a specific group
export const getFixturesByGroup = async (groupName: string): Promise<Match[]> => {
  const fixtures = await getFixtures();
  return fixtures.filter(
    (match) => match.group?.group_name === groupName
  );
};

// Get fixtures for a specific stage
export const getFixturesByStage = async (stageName: string): Promise<Match[]> => {
  const fixtures = await getFixtures();
  return fixtures.filter(
    (match) => match.tournament_stage?.stage_name === stageName
  );
};

// Get upcoming fixtures
export const getUpcomingFixtures = async (limit: number = 10): Promise<Match[]> => {
  const fixtures = await getFixtures();
  const now = new Date();
  
  return fixtures
    .filter((match) => {
      const matchDate = new Date(match.match_date);
      return matchDate > now && match.status === 'scheduled';
    })
    .sort((a, b) => {
      const dateA = new Date(a.match_date);
      const dateB = new Date(b.match_date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, limit);
};

// Refresh fixtures manually
export const refreshFixtures = async (): Promise<Match[]> => {
  return getFixtures(true);
};
