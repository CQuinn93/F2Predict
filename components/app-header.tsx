import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { DesignColors } from '@/constants/design-colors';

export function AppHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Link href="/modal" style={styles.iconButton}>
        <IconSymbol name="gearshape.fill" size={22} color="#FFFFFF" />
      </Link>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        contentFit="contain"
      />
      <Link href="/modal" style={styles.iconButton}>
        <IconSymbol name="rectangle.portrait.and.arrow.right" size={22} color="#FFFFFF" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: DesignColors.text,
  },
  logo: {
    width: 120,
    height: 40,
  },
  iconButton: {
    padding: 4,
    width: 30,
    alignItems: 'center',
  },
});
