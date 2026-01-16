import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { CountryFlag } from '@/components/country-flag';
import { DesignColors } from '@/constants/design-colors';

export default function HomeScreen() {
  const username = 'Guest Manager'; // Placeholder - will be replaced with actual user data

  const nextMatch = {
    id: '1',
    homeTeam: { code: 'US', name: 'USA' },
    awayTeam: { code: 'MX', name: 'Mexico' },
    time: 'June 12 • 7:00 PM',
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
        {/* Points Summary */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsSection}>
            <View style={styles.pointsItem}>
              <Text style={styles.pointsLabel}>Ante Post</Text>
              <View style={styles.pointsRectangle}>
                <Text style={styles.pointsValue}>42</Text>
              </View>
            </View>
            <View style={styles.pointsItem}>
              <Text style={styles.pointsLabel}>Total</Text>
              <View style={styles.pointsRectangle}>
                <Text style={styles.pointsValue}>128</Text>
              </View>
            </View>
            <View style={styles.pointsItem}>
              <Text style={styles.pointsLabel}>Live Selection</Text>
              <View style={styles.pointsRectangle}>
                <Text style={styles.pointsValue}>86</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Next Upcoming Game */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Upcoming Game</Text>
          <View style={styles.matchCard}>
            <View style={styles.matchHeader}>
              <View style={styles.matchTeams}>
                <CountryFlag
                  countryCode={nextMatch.homeTeam.code}
                  countryName={nextMatch.homeTeam.name}
                  size={40}
                />
                <Text style={styles.vsText}>vs</Text>
                <CountryFlag
                  countryCode={nextMatch.awayTeam.code}
                  countryName={nextMatch.awayTeam.name}
                  size={40}
                />
              </View>
              <Text style={styles.matchTime}>{nextMatch.time}</Text>
            </View>
            <View style={styles.predictionsRow}>
              <View style={styles.predictionBox}>
                <Text style={styles.predictionLabel}>Ante Post</Text>
                <Text style={styles.predictionValue}>{nextMatch.antePostPrediction}</Text>
              </View>
              <View style={styles.predictionBox}>
                <Text style={styles.predictionLabel}>Live Prediction</Text>
                <Text style={styles.predictionValue}>{nextMatch.livePrediction}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* World Cup Standings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>World Cup Standings</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stagesScroll}>
            {worldCupStages.map((stage) => (
              <View key={stage.id} style={styles.stageCard}>
                <Text style={styles.stageTitle}>{stage.name}</Text>
                <View style={styles.standingsPlaceholder}>
                  <Text style={styles.standingsText}>Standings for {stage.name} coming soon...</Text>
                </View>
              </View>
            ))}
          </ScrollView>
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
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeText: {
    color: DesignColors.textOnDark,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    opacity: 0.9,
  },
  pointsCard: {
    backgroundColor: '#474A4A',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 0,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 12,
  },
  pointsItem: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  pointsRectangle: {
    width: '80%',
    aspectRatio: 1.3,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: DesignColors.surface,
    backgroundColor: DesignColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  pointsLabel: {
    color: DesignColors.textOnDark,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Ethnocentric',
  },
  pointsValue: {
    color: DesignColors.textOnDark,
    fontSize: 20,
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
  sectionTitle: {
    color: DesignColors.text,
    fontSize: 20,
    fontWeight: '700',
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
});
