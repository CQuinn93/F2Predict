import { useEffect, useState, useRef } from 'react';
import { Link, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { CountryFlag } from '@/components/country-flag';
import { DesignColors } from '@/constants/design-colors';
import { getUpcomingFixtures, getFixtures, type Match } from '@/services/fixtures';
import { supabase } from '@/utils/supabase';
import { getUserProfile } from '@/services/user-profile';
import { 
  getAllAntePostPredictions, 
  getAntePostLockedStatus,
  getGroupPredictions,
} from '@/services/async-predictions';
import { getUserPredictions, type Prediction } from '@/services/predictions';

function AntePostButton() {
  const [buttonText, setButtonText] = useState('Start your Ante Post selections');
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    checkAntePostStatus();
  }, []);

  const checkAntePostStatus = async () => {
    try {
      const isLocked = await getAntePostLockedStatus();
      if (isLocked) {
        setShowButton(false);
        setLoading(false);
        return;
      }

      const allPredictions = await getAllAntePostPredictions();
      const hasAnyPredictions =
        Object.keys(allPredictions.group).length > 0 ||
        Object.keys(allPredictions.r32).length > 0 ||
        Object.keys(allPredictions.r16).length > 0 ||
        Object.keys(allPredictions.qf).length > 0 ||
        Object.keys(allPredictions.sf).length > 0 ||
        Object.keys(allPredictions.bronzeFinal).length > 0 ||
        Object.keys(allPredictions.final).length > 0;

      setButtonText(hasAnyPredictions ? 'Continue your Ante Post selections' : 'Start your Ante Post selections');
    } catch (error) {
      console.error('Error checking ante post status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!showButton) return null;

  return (
    <TouchableOpacity
      style={styles.antePostButton}
      onPress={() => router.push('/ante-post-navigation')}
    >
      <Text style={styles.antePostButtonText}>
        {loading ? 'Loading...' : buttonText}
      </Text>
    </TouchableOpacity>
  );
}

type PredictionTab = 'ante_post' | 'live';

interface GroupSummary {
  groupName: string;
  teams: { 
    code: string; 
    name: string; 
    position: number;
    won: number;
    drawn: number;
    lost: number;
    points: number;
  }[];
}

interface CurrentStandingsGroup {
  groupName: string;
  teams: {
    position: number;
    code: string;
    name: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }[];
}

export default function HomeScreen() {
  const [username, setUsername] = useState<string>('Guest Manager');
  const [firstMatch, setFirstMatch] = useState<Match | null>(null);
  const [upcomingFixtures, setUpcomingFixtures] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const profileLoadedRef = useRef(false); // Track if profile has been loaded to prevent duplicate calls
  const [predictionTab, setPredictionTab] = useState<PredictionTab>('ante_post');
  const [groupSummaries, setGroupSummaries] = useState<GroupSummary[]>([]);
  const [groupSummariesLoading, setGroupSummariesLoading] = useState(false);
  const [currentStandings, setCurrentStandings] = useState<CurrentStandingsGroup[]>([]);

  useEffect(() => {
    const loadFirstMatch = async () => {
      try {
        const upcoming = await getUpcomingFixtures(3);
        if (upcoming.length > 0) {
          setFirstMatch(upcoming[0]);
          setUpcomingFixtures(upcoming);
        }
      } catch (error) {
        console.error('Error loading first match:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFirstMatch();
  }, []);

  useEffect(() => {
    const loadGroupSummaries = async () => {
      setGroupSummariesLoading(true);
      try {
        const [fixtures, localGroupPredictions] = await Promise.all([
          getFixtures().catch(() => [] as Match[]),
          getGroupPredictions().catch(() => ({} as Record<string, { home_score: number | null; away_score: number | null }>)),
        ]);

        let groupPredictions = localGroupPredictions;

        // If there are no local group predictions (e.g. after final submission),
        // try loading from the database so we can still show a summary.
        if (Object.keys(groupPredictions).length === 0) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;
            if (userId) {
              const dbPredictions = await getUserPredictions(userId);
              const antePostGroupPreds = dbPredictions.filter(
                (p) => p.prediction_type === 'ante_post' && p.match_id !== null
              );

              const dbMap: Record<string, { home_score: number | null; away_score: number | null }> = {};
              antePostGroupPreds.forEach((p) => {
                const matchId = p.match_id as string;
                dbMap[matchId] = {
                  home_score: p.home_score,
                  away_score: p.away_score,
                };
              });

              groupPredictions = dbMap;
            }
          } catch (error) {
            console.error('Error loading group predictions for home summary from database:', error);
          }
        }

        if (fixtures.length === 0) {
          setGroupSummaries([]);
          setCurrentStandings([]);
          return;
        }

        const fixturesByGroup: Record<string, Match[]> = {};
        fixtures.forEach((match) => {
          const groupName = match.group?.group_name;
          if (!groupName) return;
          if (!fixturesByGroup[groupName]) {
            fixturesByGroup[groupName] = [];
          }
          fixturesByGroup[groupName].push(match);
        });

        const summaries: GroupSummary[] = [];
        const standingsForAllGroups: CurrentStandingsGroup[] = [];

        Object.entries(fixturesByGroup).forEach(([groupName, groupMatches]) => {
          const predictionStandingsMap: Record<string, {
            teamId: string;
            code: string;
            name: string;
            played: number;
            won: number;
            drawn: number;
            lost: number;
            goalsFor: number;
            goalsAgainst: number;
            goalDifference: number;
            points: number;
          }> = {};
          const currentStandingsMap: Record<string, {
            teamId: string;
            code: string;
            name: string;
            played: number;
            won: number;
            drawn: number;
            lost: number;
            goalsFor: number;
            goalsAgainst: number;
            goalDifference: number;
            points: number;
          }> = {};

          // Initialize teams
          groupMatches.forEach((match) => {
            if (match.home_team && !predictionStandingsMap[match.home_team.id]) {
              const baseTeam = {
                teamId: match.home_team.id,
                code: match.home_team.country_code,
                name: match.home_team.country_name,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
              };
              predictionStandingsMap[match.home_team.id] = { ...baseTeam };
              currentStandingsMap[match.home_team.id] = {
                ...baseTeam,
                won: 0,
                drawn: 0,
                lost: 0,
              };
            }
            if (match.away_team && !predictionStandingsMap[match.away_team.id]) {
              const baseTeam = {
                teamId: match.away_team.id,
                code: match.away_team.country_code,
                name: match.away_team.country_name,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
              };
              predictionStandingsMap[match.away_team.id] = { ...baseTeam };
              currentStandingsMap[match.away_team.id] = {
                ...baseTeam,
                won: 0,
                drawn: 0,
                lost: 0,
              };
            }

            // Apply ante post predictions (for the "Your Predictions" group tables)
            const pred = groupPredictions[match.id];
            if (pred && match.home_team && match.away_team) {
              const homeScore = pred.home_score;
              const awayScore = pred.away_score;

              if (
                homeScore !== null &&
                awayScore !== null &&
                typeof homeScore === 'number' &&
                typeof awayScore === 'number'
              ) {
                const homeTeam = predictionStandingsMap[match.home_team.id];
                const awayTeam = predictionStandingsMap[match.away_team.id];

                homeTeam.played += 1;
                awayTeam.played += 1;

                homeTeam.goalsFor += homeScore;
                homeTeam.goalsAgainst += awayScore;
                awayTeam.goalsFor += awayScore;
                awayTeam.goalsAgainst += homeScore;

                homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
                awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;

                if (homeScore > awayScore) {
                  homeTeam.points += 3;
                  homeTeam.won += 1;
                  awayTeam.lost += 1;
                } else if (awayScore > homeScore) {
                  awayTeam.points += 3;
                  awayTeam.won += 1;
                  homeTeam.lost += 1;
                } else {
                  homeTeam.points += 1;
                  awayTeam.points += 1;
                  homeTeam.drawn += 1;
                  awayTeam.drawn += 1;
                }
              }
            }

            // Apply real results (for Current Standings)
            if (
              match.home_team &&
              match.away_team &&
              match.home_score !== null &&
              match.away_score !== null &&
              typeof match.home_score === 'number' &&
              typeof match.away_score === 'number'
            ) {
              const homeTeam = currentStandingsMap[match.home_team.id];
              const awayTeam = currentStandingsMap[match.away_team.id];

              homeTeam.played += 1;
              awayTeam.played += 1;

              homeTeam.goalsFor += match.home_score;
              homeTeam.goalsAgainst += match.away_score;
              awayTeam.goalsFor += match.away_score;
              awayTeam.goalsAgainst += match.home_score;

              homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
              awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;

              if (match.home_score > match.away_score) {
                homeTeam.won += 1;
                awayTeam.lost += 1;
                homeTeam.points += 3;
              } else if (match.away_score > match.home_score) {
                awayTeam.won += 1;
                homeTeam.lost += 1;
                awayTeam.points += 3;
              } else {
                homeTeam.drawn += 1;
                awayTeam.drawn += 1;
                homeTeam.points += 1;
                awayTeam.points += 1;
              }
            }
          });

          // Build ante post group tables (predicted) if we have any predictions
          if (Object.keys(groupPredictions).length > 0) {
            const predictionStandings = Object.values(predictionStandingsMap);

            predictionStandings.sort((a, b) => {
              if (b.points !== a.points) return b.points - a.points;
              if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
              return b.goalsFor - a.goalsFor;
            });

            const teams = predictionStandings.map((t, idx) => ({
              code: t.code,
              name: t.name,
              position: idx + 1,
              won: t.won,
              drawn: t.drawn,
              lost: t.lost,
              points: t.points,
            }));

            if (teams.length > 0) {
              summaries.push({
                groupName,
                teams,
              });
            }
          }

          // Build current standings tables from real results
          const current = Object.values(currentStandingsMap);
          current.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
          });

          const currentTeams = current.map((t, idx) => ({
            position: idx + 1,
            code: t.code,
            name: t.name,
            played: t.played,
            won: t.won,
            drawn: t.drawn,
            lost: t.lost,
            goalsFor: t.goalsFor,
            goalsAgainst: t.goalsAgainst,
            goalDifference: t.goalDifference,
            points: t.points,
          }));

          standingsForAllGroups.push({
            groupName,
            teams: currentTeams,
          });
        });

        summaries.sort((a, b) => a.groupName.localeCompare(b.groupName));
        setGroupSummaries(summaries);
        standingsForAllGroups.sort((a, b) => a.groupName.localeCompare(b.groupName));
        setCurrentStandings(standingsForAllGroups);
      } catch (error) {
        console.error('Error building group summaries for home screen:', error);
        setGroupSummaries([]);
        setCurrentStandings([]);
      } finally {
        setGroupSummariesLoading(false);
      }
    };

    loadGroupSummaries();
  }, []);

  const handleViewAllPredictions = () => {
    if (predictionTab === 'ante_post') {
      router.push('/ante-post-navigation');
    } else {
      router.push('/(tabs)/predictions');
    }
  };

  const handleViewAllFixtures = () => {
    router.push('/(tabs)/fixtures');
  };

  const handleViewAllResults = () => {
    router.push('/(tabs)/fixtures');
  };

  useEffect(() => {
    // Use session instead of getUser() to avoid duplicate auth request
    const loadUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setUsername(profile.username);
          }
          profileLoadedRef.current = true; // Mark as loaded
        } else {
          setUsername('Guest Manager');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUsername('Guest Manager');
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();

    // Listen for auth state changes - skip initial duplicate call using ref flag
    let isInitialEvent = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip the first event since it's the initial session (already handled in loadUserProfile)
      if (isInitialEvent) {
        isInitialEvent = false;
        return;
      }

      // Only handle actual auth state changes (login, logout, token refresh, etc.)
      if (session?.user) {
        try {
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setUsername(profile.username);
          }
          profileLoadedRef.current = true;
        } catch (error) {
          console.error('Error loading user profile on auth change:', error);
        }
      } else {
        setUsername('Guest Manager');
        profileLoadedRef.current = false;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const nextMatch = {
    id: firstMatch?.id || '1',
    homeTeam: { 
      code: firstMatch?.home_team?.country_code || 'US', 
      name: firstMatch?.home_team?.country_name || 'USA' 
    },
    awayTeam: { 
      code: firstMatch?.away_team?.country_code || 'MX', 
      name: firstMatch?.away_team?.country_name || 'Mexico' 
    },
    time: firstMatch?.match_date 
      ? new Date(firstMatch.match_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit' 
        })
      : 'June 12 • 7:00 PM',
    antePostPrediction: 'USA 2-1',
    livePrediction: 'USA Win',
  };

  const worldCupStages = [
    { id: 'groups', name: 'Group Stage', type: 'groups' },
    { id: 'r32', name: 'Round of 32', type: 'knockout' },
    { id: 'r16', name: 'Round of 16', type: 'knockout' },
    { id: 'qf', name: 'Quarter Finals', type: 'knockout' },
    { id: 'sf', name: 'Semi Finals', type: 'knockout' },
    { id: 'final', name: 'Final', type: 'knockout' },
  ];

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.headerExtension}>
        <Text style={styles.welcomeText}>Welcome {username}</Text>

        {/* Ante Post Predictions Button */}
        <AntePostButton />
      </View>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Your Predictions - Ante Post / Live tabbed view */}
        <View style={styles.section}>
          <View style={styles.predictionsHeaderRow}>
            <Text style={styles.sectionTitle}>Your Predictions</Text>
            <TouchableOpacity onPress={handleViewAllPredictions}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.predictionsTabs}>
            <TouchableOpacity
              style={[
                styles.predictionsTab,
                predictionTab === 'ante_post' && styles.predictionsTabActive,
              ]}
              onPress={() => setPredictionTab('ante_post')}
            >
              <Text
                style={[
                  styles.predictionsTabText,
                  predictionTab === 'ante_post' ? styles.predictionsTabTextActive : styles.predictionsTabTextInactive,
                ]}
              >
                Ante Post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.predictionsTab,
                predictionTab === 'live' && styles.predictionsTabActive,
              ]}
              onPress={() => setPredictionTab('live')}
            >
              <Text
                style={[
                  styles.predictionsTabText,
                  predictionTab === 'live' ? styles.predictionsTabTextActive : styles.predictionsTabTextInactive,
                ]}
              >
                Live
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pointsCard}>
            {predictionTab === 'ante_post' ? (
              <>
                <View style={styles.predictionsHeaderRow}>
                  <Text style={styles.sectionTitle}>Points</Text>
                </View>
                <View style={styles.pointsSection}>
                  <View style={styles.pointsItemContainer}>
                    <Text style={styles.pointsLabel}>Ante</Text>
                    <Text style={styles.pointsValue}>42</Text>
                  </View>
                  <View style={styles.pointsItemContainer}>
                    <Text style={styles.pointsLabel}>Live</Text>
                    <Text style={styles.pointsValue}>86</Text>
                  </View>
                  <View style={styles.pointsItemContainer}>
                    <Text style={styles.pointsLabel}>Total</Text>
                    <Text style={styles.pointsValue}>128</Text>
                  </View>
                </View>

                <View style={styles.groupSummaryContainer}>
                  {groupSummariesLoading ? (
                    <Text style={styles.groupSummaryPlaceholder}>
                      Loading your group tables...
                    </Text>
                  ) : groupSummaries.length === 0 ? (
                    <Text style={styles.groupSummaryPlaceholder}>
                      Your group tables will appear here once you make ante post predictions.
                    </Text>
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.groupSummaryScroll}
                    >
                      {groupSummaries.map((group) => (
                        <View key={group.groupName} style={styles.groupSummaryCard}>
                          <Text style={styles.groupSummaryGroupName}>
                            Group {group.groupName}
                          </Text>
                          <View style={styles.groupTable}>
                            {/* Header row: same structure as data rows */}
                            <View style={[styles.groupTableRowBase, styles.groupTableHeaderRow]}>
                              <View style={[styles.groupTableCell, styles.groupTableHeaderCell, styles.groupTableCellNo]}>
                                <Text style={styles.groupTableHeaderText}>NO</Text>
                              </View>
                              <View style={[styles.groupTableCell, styles.groupTableHeaderCell, styles.groupTableCellClub]}>
                                <Text style={styles.groupTableHeaderText}>CLUB</Text>
                              </View>
                              <View style={[styles.groupTableCell, styles.groupTableHeaderCell, styles.groupTableCellStat]}>
                                <Text style={styles.groupTableHeaderText}>W</Text>
                              </View>
                              <View style={[styles.groupTableCell, styles.groupTableHeaderCell, styles.groupTableCellStat]}>
                                <Text style={styles.groupTableHeaderText}>D</Text>
                              </View>
                              <View style={[styles.groupTableCell, styles.groupTableHeaderCell, styles.groupTableCellStat]}>
                                <Text style={styles.groupTableHeaderText}>L</Text>
                              </View>
                              <View style={[styles.groupTableCell, styles.groupTableHeaderCell, styles.groupTableCellPts, styles.groupTableCellLast]}>
                                <Text style={styles.groupTableHeaderText}>PTS</Text>
                              </View>
                            </View>
                            {group.teams.map((team, idx) => {
                              const isLast = idx === group.teams.length - 1;
                              return (
                                <View
                                  key={`${group.groupName}-${team.code}`}
                                  style={[
                                    styles.groupTableRowBase,
                                    styles.groupTableDataRow,
                                    isLast && styles.groupTableDataRowLast,
                                  ]}
                                >
                                  <View style={[styles.groupTableCell, styles.groupTableDataCell, styles.groupTableCellNo]}>
                                    <Text style={styles.groupTableDataText}>
                                      {String(team.position).padStart(2, '0')}
                                    </Text>
                                  </View>
                                  <View style={[styles.groupTableCell, styles.groupTableDataCell, styles.groupTableCellClub, styles.groupTableCellClubData]}>
                                    <CountryFlag
                                      countryCode={team.code}
                                      countryName={team.name}
                                      flagSize={18}
                                      showName={false}
                                    />
                                    <Text
                                      style={styles.groupTableClubText}
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                    >
                                      {team.name}
                                    </Text>
                                  </View>
                                  <View style={[styles.groupTableCell, styles.groupTableDataCell, styles.groupTableCellStat]}>
                                    <Text style={styles.groupTableDataText}>{team.won}</Text>
                                  </View>
                                  <View style={[styles.groupTableCell, styles.groupTableDataCell, styles.groupTableCellStat]}>
                                    <Text style={styles.groupTableDataText}>{team.drawn}</Text>
                                  </View>
                                  <View style={[styles.groupTableCell, styles.groupTableDataCell, styles.groupTableCellStat]}>
                                    <Text style={styles.groupTableDataText}>{team.lost}</Text>
                                  </View>
                                  <View style={[styles.groupTableCell, styles.groupTableDataCell, styles.groupTableCellPts, styles.groupTableCellLast]}>
                                    <Text style={styles.groupTableDataText}>{team.points}</Text>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.livePlaceholder}>
                <Text style={styles.livePlaceholderText}>
                  Live predictions summary coming soon.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Upcoming Games */}
        <View style={styles.section}>
          <View style={styles.predictionsHeaderRow}>
            <Text style={styles.sectionTitle}>Upcoming games</Text>
            <TouchableOpacity onPress={handleViewAllFixtures}>
              <Text style={styles.viewAllText}>View all fixtures</Text>
            </TouchableOpacity>
          </View>
          {upcomingFixtures.length === 0 ? (
            <Text style={styles.upcomingPlaceholder}>
              No upcoming games scheduled.
            </Text>
          ) : (
            <View style={styles.upcomingList}>
              {upcomingFixtures.map((match) => (
                <View key={match.id} style={styles.upcomingGameCard}>
                  <View style={styles.upcomingRow}>
                    <View style={styles.upcomingFlag}>
                      {match.home_team ? (
                        <CountryFlag
                          countryCode={match.home_team.country_code}
                          countryName={match.home_team.country_name}
                          flagSize={16}
                          showName={false}
                        />
                      ) : null}
                    </View>
                    <Text style={[styles.upcomingTeamName, styles.upcomingTeamNameHome]} numberOfLines={1} ellipsizeMode="tail">
                      {match.home_team?.country_name ?? 'TBD'}
                    </Text>
                    <View style={styles.upcomingVs}>
                      <Text style={styles.upcomingVsText}>vs</Text>
                    </View>
                    <Text style={[styles.upcomingTeamName, styles.upcomingTeamNameAway]} numberOfLines={1} ellipsizeMode="tail">
                      {match.away_team?.country_name ?? 'TBD'}
                    </Text>
                    <View style={styles.upcomingFlag}>
                      {match.away_team ? (
                        <CountryFlag
                          countryCode={match.away_team.country_code}
                          countryName={match.away_team.country_name}
                          flagSize={16}
                          showName={false}
                        />
                      ) : null}
                    </View>
                  </View>
                  <Text style={styles.upcomingMetaText} numberOfLines={1} ellipsizeMode="tail">
                    {new Date(match.match_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}{' '}
                    • {match.venue?.city ?? 'TBD'}
                    {match.venue?.name ? `, ${match.venue.name}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Current Standings */}
        <View style={styles.section}>
          <View style={styles.predictionsHeaderRow}>
            <Text style={styles.sectionTitle}>Current standings</Text>
            <TouchableOpacity onPress={handleViewAllResults}>
              <Text style={styles.viewAllText}>View all results</Text>
            </TouchableOpacity>
          </View>
          {currentStandings.length === 0 ? (
            <Text style={styles.groupSummaryPlaceholder}>
              Group tables will appear here as fixtures are played.
            </Text>
          ) : (
            currentStandings.map((group) => (
              <View key={group.groupName} style={styles.currentGroupCard}>
                <Text style={styles.currentGroupTitle}>Group {group.groupName}</Text>
                <View style={styles.currentChipsRow}>
                  {group.teams.map((team) => (
                    <View
                      key={`${group.groupName}-${team.code}`}
                      style={styles.currentChip}
                    >
                      <Text style={styles.currentChipPosition}>{team.position}</Text>
                      <CountryFlag
                        countryCode={team.code}
                        countryName={team.name}
                        flagSize={16}
                      />
                      <Text
                        style={styles.currentChipTeam}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {team.name}
                      </Text>
                      <Text style={styles.currentChipPoints}>{team.points} pts</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerExtension: {
    backgroundColor: DesignColors.text,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeText: {
    color: DesignColors.textOnDark,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
    opacity: 0.9,
  },
  antePostButton: {
    backgroundColor: DesignColors.primary,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  antePostButtonText: {
    color: DesignColors.textOnDark,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Ethnocentric',
  },
  pointsCard: {
    backgroundColor: DesignColors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: DesignColors.surface,
  },
  pointsSection: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  pointsItemContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(71, 74, 74, 0.12)',
  },
  pointsLabel: {
    color: DesignColors.primary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  pointsValue: {
    color: DesignColors.text,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Ethnocentric',
  },
  content: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 80,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  predictionsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    color: DesignColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  viewAllText: {
    color: DesignColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  predictionsTabs: {
    flexDirection: 'row',
    backgroundColor: DesignColors.surface,
    borderRadius: 999,
    padding: 2,
    marginBottom: 10,
  },
  predictionsTab: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 6,
    alignItems: 'center',
  },
  predictionsTabActive: {
    backgroundColor: '#FFFFFF',
  },
  predictionsTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  predictionsTabTextActive: {
    color: DesignColors.primary,
  },
  predictionsTabTextInactive: {
    color: DesignColors.text,
    opacity: 0.7,
  },
  matchCard: {
    borderRadius: 18,
    backgroundColor: DesignColors.surface,
    padding: 16,
    gap: 16,
  },
  matchHeader: {
    gap: 12,
    alignItems: 'center',
  },
  matchTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  vsText: {
    color: DesignColors.text,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
  matchTime: {
    color: DesignColors.text,
    fontSize: 14,
    opacity: 0.7,
  },
  predictionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  predictionBox: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DesignColors.surface,
  },
  predictionLabel: {
    color: DesignColors.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  predictionValue: {
    color: DesignColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  stagesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  stageCard: {
    width: 280,
    borderRadius: 18,
    backgroundColor: DesignColors.surface,
    padding: 16,
    marginRight: 16,
  },
  stageTitle: {
    color: DesignColors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  standingsPlaceholder: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standingsText: {
    color: DesignColors.text,
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  groupSummaryContainer: {
    marginTop: 12,
  },
  groupSummaryScroll: {
    gap: 8,
  },
  groupSummaryCard: {
    minWidth: 250,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  groupSummaryGroupName: {
    color: DesignColors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  groupSummaryPlaceholder: {
    color: DesignColors.text,
    fontSize: 12,
    opacity: 0.7,
  },
  livePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  livePlaceholderText: {
    color: DesignColors.text,
    fontSize: 12,
    opacity: 0.7,
  },
  groupTable: {
    marginTop: 2,
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(71, 74, 74, 0.2)',
  },
  /* Shared row: same layout for header and data. No row-level padding. */
  groupTableRowBase: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 30,
  },
  groupTableHeaderRow: {
    backgroundColor: DesignColors.primary,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  },
  groupTableDataRow: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71, 74, 74, 0.15)',
  },
  groupTableDataRowLast: {
    borderBottomWidth: 0,
  },
  /* Shared cell: identical padding for header and data. Column styles set width only. */
  groupTableCell: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    justifyContent: 'center',
  },
  groupTableHeaderCell: {
    borderRightColor: 'rgba(255, 255, 255, 0.35)',
  },
  groupTableDataCell: {
    borderRightColor: 'rgba(71, 74, 74, 0.15)',
  },
  groupTableCellLast: {
    borderRightWidth: 0,
  },
  /* Column widths: same for header and data. CLUB flexes, rest fixed. */
  groupTableCellNo: {
    width: 40,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'flex-start',
  },
  groupTableCellClub: {
    flex: 1,
    width: 150,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  groupTableCellClubData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    flexWrap: 'nowrap',
    flex: 1,
    minWidth: 50,
    overflow: 'hidden',
  },
  groupTableCellStat: {
    width: 40,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
  },
  groupTableCellPts: {
    width: 40,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
  },
  groupTableHeaderText: {
    color: DesignColors.textOnDark,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  groupTableDataText: {
    color: DesignColors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  groupTableClubText: {
    color: DesignColors.text,
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
    flex: 1,
    minWidth: 0,
  },
  upcomingList: {
    gap: 8,
  },
  upcomingGameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(71, 74, 74, 0.12)',
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  upcomingFlag: {
    width: 20,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingTeamName: {
    flex: 1,
    minWidth: 0,
    color: DesignColors.text,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  upcomingTeamNameHome: {
    textAlign: 'right',
  },
  upcomingTeamNameAway: {
    textAlign: 'left',
  },
  upcomingVs: {
    width: 32,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingVsText: {
    color: DesignColors.text,
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.6,
  },
  upcomingPlaceholder: {
    color: DesignColors.text,
    fontSize: 12,
    opacity: 0.7,
  },
  upcomingMetaText: {
    color: DesignColors.text,
    fontSize: 10,
    opacity: 0.7,
  },
  currentGroupCard: {
    borderRadius: 12,
    backgroundColor: DesignColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  currentGroupTitle: {
    color: DesignColors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  currentChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  currentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: DesignColors.surface,
    gap: 4,
  },
  currentChipPosition: {
    color: DesignColors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  currentChipTeam: {
    color: DesignColors.text,
    fontSize: 11,
    maxWidth: 80,
  },
  currentChipPoints: {
    color: DesignColors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
});
