import { StyleSheet, Text, View } from 'react-native';

import { getCountryFlag } from '@/utils/country-codes';

interface CountryFlagProps {
  countryCode: string;
  countryName: string;
  flagSize?: number;
}

export function CountryFlag({ countryCode, countryName, flagSize = 40 }: CountryFlagProps) {
  const flagEmoji = getCountryFlag(countryCode);

  return (
    <View style={styles.container}>
      <Text style={[styles.flag, { fontSize: flagSize }]}>{flagEmoji}</Text>
      <Text style={styles.countryName}>{countryName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  flag: {
    lineHeight: 40,
  },
  countryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
