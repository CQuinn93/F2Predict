import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { DesignColors } from '@/constants/design-colors';

export default function PredictionsScreen() {
  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Predictions</Text>
          <Text style={styles.headerSubtitle}>Manage your match predictions</Text>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>Predictions content coming soon...</Text>
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
  content: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    gap: 4,
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
