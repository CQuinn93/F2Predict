import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { DesignColors } from '@/constants/design-colors';

const modalHref: '/modal' = '/modal';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Link href={modalHref} style={styles.actionCard}>
              <Text style={styles.actionTitle}>Edit Profile</Text>
              <Text style={styles.actionSubtitle}>Avatar, bio, and region</Text>
            </Link>
            <Link href={modalHref} style={styles.actionCard}>
              <Text style={styles.actionTitle}>My Teams</Text>
              <Text style={styles.actionSubtitle}>Track favorites</Text>
            </Link>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.linkStack}>
            <Link href={modalHref} style={styles.linkRow}>
              <Text style={styles.linkText}>Notifications</Text>
            </Link>
            <Link href={modalHref} style={styles.linkRow}>
              <Text style={styles.linkText}>Privacy &amp; Security</Text>
            </Link>
            <Link href={modalHref} style={styles.linkRow}>
              <Text style={styles.linkText}>Sign Out</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignColors.background,
  },
  content: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 28,
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
    backgroundColor: DesignColors.surface,
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: DesignColors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  profileHandle: {
    color: DesignColors.surface,
    fontSize: 14,
  },
  profileMeta: {
    color: DesignColors.surface,
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
    color: DesignColors.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: DesignColors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: DesignColors.primary,
    padding: 14,
    gap: 6,
  },
  actionTitle: {
    color: DesignColors.textOnDark,
    fontSize: 15,
    fontWeight: '600',
  },
  actionSubtitle: {
    color: DesignColors.textOnDark,
    fontSize: 12,
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
  linkStack: {
    borderRadius: 18,
    backgroundColor: DesignColors.surface,
    paddingVertical: 4,
  },
  linkRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71, 74, 74, 0.12)',
  },
  linkText: {
    color: DesignColors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
