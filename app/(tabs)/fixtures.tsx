import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { CountryFlag } from '@/components/country-flag';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { DesignColors } from '@/constants/design-colors';
import { getFixtures, refreshFixtures, type Match } from '@/services/fixtures';
import { getUserPredictionsForMatch, type Prediction } from '@/services/predictions';
import { supabase } from '@/utils/supabase';

export default function FixturesScreen() {
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [userPredictions, setUserPredictions] = useState<Record<string, { ante_post: Prediction | null; live: Prediction | null }>>({});
  const [userId, setUserId] = useState<string | null>(null);

  const loadFixtures = async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
        const data = await refreshFixtures();
        setFixtures(data);
        setRefreshing(false);
      } else {
        setLoading(true);
        const data = await getFixtures();
        setFixtures(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading fixtures:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFixtures();
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (userId && expandedMatchId) {
      loadPredictionsForMatch(expandedMatchId);
    }
  }, [userId, expandedMatchId]);

  const getCurrentUser = async () => {
    try {
      // Use session instead of getUser() to avoid duplicate auth request
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const loadPredictionsForMatch = async (matchId: string) => {
    if (!userId) return;

    try {
      const predictions = await getUserPredictionsForMatch(userId, matchId);
      setUserPredictions((prev) => ({
        ...prev,
        [matchId]: predictions,
      }));
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
  };

  const toggleMatchExpansion = (matchId: string) => {
    if (expandedMatchId === matchId) {
      setExpandedMatchId(null);
    } else {
      setExpandedMatchId(matchId);
      if (!userPredictions[matchId] && userId) {
        loadPredictionsForMatch(matchId);
      }
    }
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatMatchTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return DesignColors.accent;
      case 'finished':
        return DesignColors.text;
      case 'scheduled':
        return DesignColors.primary;
      default:
        return DesignColors.surface;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignColors.primary} />
          <Text style={styles.loadingText}>Loading fixtures...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadFixtures(true)}
            tintColor={DesignColors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Fixtures</Text>
          <Text style={styles.headerSubtitle}>Upcoming match schedule</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={() => loadFixtures(true)}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {fixtures.length === 0 ? (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>No fixtures available</Text>
          </View>
        ) : (
          fixtures.map((match) => {
            const isExpanded = expandedMatchId === match.id;
            const predictions = userPredictions[match.id] || { ante_post: null, live: null };

            return (
              <View key={match.id} style={styles.matchCard}>
                {/* Match Header - Game # and Group # */}
                <View style={styles.matchHeader}>
                  <Text style={styles.matchInfoText}>
                    Game #{match.match_number}
                    {match.group && ` • Group ${match.group.group_name}`}
                  </Text>
                </View>

                {/* Main Match Row */}
                <TouchableOpacity
                  style={styles.matchRow}
                  onPress={() => toggleMatchExpansion(match.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.matchTeams}>
                    {/* Home Team - Left Aligned */}
                    {match.home_team && (
                      <View style={styles.homeTeamContainer}>
                        <CountryFlag
                          countryCode={match.home_team.country_code}
                          countryName={match.home_team.country_name}
                          flagSize={50}
                          align="left"
                          namePosition="beside"
                          reverseOrder={false}
                        />
                        {(match.home_score !== null || match.away_score !== null) && (
                          <Text style={styles.scoreText}>{match.home_score ?? '-'}</Text>
                        )}
                      </View>
                    )}
                    
                    {/* VS - Centered */}
                    <View style={styles.vsContainer}>
                      <Text style={styles.vsText}>vs</Text>
                    </View>
                    
                    {/* Away Team - Right Aligned (Name then Logo) */}
                    {match.away_team && (
                      <View style={styles.awayTeamContainer}>
                        <CountryFlag
                          countryCode={match.away_team.country_code}
                          countryName={match.away_team.country_name}
                          flagSize={50}
                          align="right"
                          namePosition="beside"
                          reverseOrder={true}
                        />
                        {(match.home_score !== null || match.away_score !== null) && (
                          <Text style={styles.scoreText}>{match.away_score ?? '-'}</Text>
                        )}
                      </View>
                    )}
                  </View>

                  <IconSymbol
                    name={isExpanded ? 'chevron.up' : 'chevron.down'}
                    size={18}
                    color={DesignColors.text}
                  />
                </TouchableOpacity>

                {/* Expanded Details */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    {/* Venue and Date/Time in a Row */}
                    <View style={styles.infoRow}>
                      {/* Venue Info */}
                      {match.venue && (
                        <View style={styles.venueSection}>
                          <View style={styles.venueHeader}>
                            <IconSymbol name="location.fill" size={14} color={DesignColors.primary} />
                            <Text style={styles.venueTitle}>Venue</Text>
                          </View>
                          <Text style={styles.venueName}>{match.venue.name}</Text>
                          <Text style={styles.venueLocation}>{match.venue.city}</Text>
                        </View>
                      )}

                      {/* Divider */}
                      <View style={styles.infoDivider} />

                      {/* Match Date/Time */}
                      <View style={styles.dateSection}>
                        <View style={styles.dateHeader}>
                          <IconSymbol name="calendar" size={14} color={DesignColors.primary} />
                          <Text style={styles.dateTitle}>Date & Time</Text>
                        </View>
                        <Text style={styles.dateText}>{formatMatchDate(match.match_date)}</Text>
                        <Text style={styles.timeText}>{formatMatchTime(match.match_date)}</Text>
                      </View>
                    </View>

                    {/* User Predictions */}
                    {(predictions.ante_post || predictions.live) && (
                      <View style={styles.predictionsSection}>
                        <Text style={styles.predictionsTitle}>Your Predictions</Text>
                        
                        {predictions.ante_post && (
                          <View style={styles.predictionCard}>
                            <View style={styles.predictionHeader}>
                              <Text style={styles.predictionType}>Ante Post</Text>
                              {predictions.ante_post.points_awarded !== null && predictions.ante_post.points_awarded > 0 && (
                                <View style={styles.pointsBadge}>
                                  <Text style={styles.pointsText}>+{predictions.ante_post.points_awarded} pts</Text>
                                </View>
                              )}
                            </View>
                            {predictions.ante_post.home_score !== null && predictions.ante_post.away_score !== null ? (
                              <Text style={styles.predictionScore}>
                                {predictions.ante_post.home_score} - {predictions.ante_post.away_score}
                              </Text>
                            ) : predictions.ante_post.predicted_winner ? (
                              <Text style={styles.predictionWinner}>
                                {predictions.ante_post.predicted_winner.country_name} to win
                              </Text>
                            ) : (
                              <Text style={styles.predictionPlaceholder}>No prediction made</Text>
                            )}
                          </View>
                        )}

                        {predictions.live && (
                          <View style={styles.predictionCard}>
                            <View style={styles.predictionHeader}>
                              <Text style={styles.predictionType}>Live Selection</Text>
                              {predictions.live.points_awarded !== null && predictions.live.points_awarded > 0 && (
                                <View style={styles.pointsBadge}>
                                  <Text style={styles.pointsText}>+{predictions.live.points_awarded} pts</Text>
                                </View>
                              )}
                            </View>
                            {predictions.live.home_score !== null && predictions.live.away_score !== null ? (
                              <Text style={styles.predictionScore}>
                                {predictions.live.home_score} - {predictions.live.away_score}
                              </Text>
                            ) : predictions.live.predicted_winner ? (
                              <Text style={styles.predictionWinner}>
                                {predictions.live.predicted_winner.country_name} to win
                              </Text>
                            ) : (
                              <Text style={styles.predictionPlaceholder}>No prediction made</Text>
                            )}
                          </View>
                        )}

                        {!predictions.ante_post && !predictions.live && (
                          <Text style={styles.noPredictionsText}>No predictions made for this match</Text>
                        )}
                      </View>
                    )}

                    {!predictions.ante_post && !predictions.live && (
                      <View style={styles.noPredictionsSection}>
                        <Text style={styles.noPredictionsText}>No predictions made yet</Text>
                        <Text style={styles.noPredictionsSubtext}>Make your predictions in the Predictions tab</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: DesignColors.text,
    fontSize: 16,
  },
  header: {
    gap: 8,
    marginBottom: 8,
  },
  headerTitle: {
    color: DesignColors.text,
    fontSize: 34,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: DesignColors.text,
    fontSize: 16,
    opacity: 0.7,
  },
  refreshButton: {
    alignSelf: 'flex-start',
    backgroundColor: DesignColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  refreshButtonText: {
    color: DesignColors.textOnDark,
    fontSize: 14,
    fontWeight: '600',
  },
  matchCard: {
    borderRadius: 18,
    backgroundColor: DesignColors.surface,
    overflow: 'hidden',
    marginBottom: 12,
  },
  matchHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71, 74, 74, 0.1)',
  },
  matchInfoText: {
    color: DesignColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  matchTeams: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  homeTeamContainer: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 6,
    paddingRight: 8,
  },
  awayTeamContainer: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 6,
    paddingLeft: 8,
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    marginHorizontal: 4,
  },
  vsText: {
    color: DesignColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  scoreText: {
    color: DesignColors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(71, 74, 74, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  venueSection: {
    flex: 1,
    gap: 6,
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venueTitle: {
    color: DesignColors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  venueName: {
    color: DesignColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  venueLocation: {
    color: DesignColors.text,
    fontSize: 12,
    opacity: 0.7,
  },
  infoDivider: {
    width: 1,
    backgroundColor: 'rgba(71, 74, 74, 0.2)',
    alignSelf: 'stretch',
    marginVertical: 4,
  },
  dateSection: {
    flex: 1,
    gap: 6,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateTitle: {
    color: DesignColors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    color: DesignColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  timeText: {
    color: DesignColors.text,
    fontSize: 12,
    opacity: 0.7,
  },
  predictionsSection: {
    gap: 12,
    paddingTop: 8,
  },
  predictionsTitle: {
    color: DesignColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  predictionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionType: {
    color: DesignColors.text,
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  pointsBadge: {
    backgroundColor: DesignColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsText: {
    color: DesignColors.textOnDark,
    fontSize: 11,
    fontWeight: '700',
  },
  predictionScore: {
    color: DesignColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  predictionWinner: {
    color: DesignColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  predictionPlaceholder: {
    color: DesignColors.text,
    fontSize: 14,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  noPredictionsSection: {
    paddingTop: 8,
    alignItems: 'center',
    gap: 4,
  },
  noPredictionsText: {
    color: DesignColors.text,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  noPredictionsSubtext: {
    color: DesignColors.text,
    fontSize: 12,
    opacity: 0.5,
  },
  placeholderCard: {
    borderRadius: 18,
    backgroundColor: DesignColors.surface,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  placeholderText: {
    color: DesignColors.text,
    fontSize: 16,
  },
});
