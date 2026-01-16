import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { DesignColors } from '@/constants/design-colors';

export default function CompetitionsScreen() {
  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Competitions</Text>
          <Text style={styles.headerSubtitle}>Join or create a competition</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join Competition</Text>
          <View style={styles.panel}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Competition Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter competition code"
                placeholderTextColor="rgba(71, 74, 74, 0.5)"
              />
            </View>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Join Competition</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Competition</Text>
          <View style={styles.panel}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Competition Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter competition name"
                placeholderTextColor="rgba(71, 74, 74, 0.5)"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Max Number of Users</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter max users"
                placeholderTextColor="rgba(71, 74, 74, 0.5)"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Create Competition</Text>
            </View>
          </View>
        </View>
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
    paddingTop: 20,
    paddingBottom: 40,
    gap: 28,
  },
  header: {
    gap: 4,
  },
  headerTitle: {
    color: DesignColors.textOnDark,
    fontSize: 34,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: DesignColors.textOnDark,
    fontSize: 16,
    opacity: 0.9,
  },
  section: {
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
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: DesignColors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(71, 74, 74, 0.2)',
    backgroundColor: DesignColors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: DesignColors.text,
  },
  button: {
    borderRadius: 12,
    backgroundColor: DesignColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: DesignColors.textOnDark,
    fontSize: 16,
    fontWeight: '600',
  },
});
