import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { DesignColors } from '@/constants/design-colors';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quick Access</Text>
          <Text style={styles.headerSubtitle}>Profile Section</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar} />
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>Guest Manager</Text>
              <Text style={styles.profileHandle}>@globalcupfan</Text>
              <Text style={styles.profileMeta}>Global Cup 2026 • Fan Zone</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Predictions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.panel}>
            <View style={styles.panelRow}>
              <Text style={styles.panelTitle}>Predictions submitted</Text>
              <Text style={styles.panelValue}>4 this week</Text>
            </View>
            <View style={styles.panelRow}>
              <Text style={styles.panelTitle}>Live picks pending</Text>
              <Text style={styles.panelValue}>2</Text>
            </View>
            <View style={styles.panelRow}>
              <Text style={styles.panelTitle}>Competitions joined</Text>
              <Text style={styles.panelValue}>3</Text>
            </View>
          </View>
        </View>

        <Link href="/" dismissTo style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignColors.secondary,
  },
  content: {
    padding: 20,
    paddingTop: 48,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    gap: 4,
    marginBottom: 8,
  },
  headerTitle: {
    color: DesignColors.textOnDark,
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: DesignColors.textOnDark,
    fontSize: 16,
    opacity: 0.9,
  },
  profileSection: {
    gap: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: DesignColors.textOnDark,
    backgroundColor: DesignColors.primary,
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: DesignColors.textOnDark,
    fontSize: 24,
    fontWeight: '700',
  },
  profileHandle: {
    color: DesignColors.textOnDark,
    fontSize: 14,
  },
  profileMeta: {
    color: DesignColors.textOnDark,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: DesignColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statValue: {
    color: DesignColors.textOnDark,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: DesignColors.textOnDark,
    fontSize: 12,
    marginTop: 4,
  },
  activitySection: {
    gap: 12,
  },
  sectionTitle: {
    color: DesignColors.textOnDark,
    fontSize: 18,
    fontWeight: '600',
  },
  panel: {
    borderRadius: 18,
    backgroundColor: DesignColors.surface,
    padding: 16,
    gap: 12,
  },
  panelRow: {
    gap: 4,
  },
  panelTitle: {
    color: DesignColors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  panelValue: {
    color: DesignColors.text,
    fontSize: 13,
  },
  closeButton: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: DesignColors.surface,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: DesignColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
