import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { DesignColors } from '@/constants/design-colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL_SCREEN = SCREEN_WIDTH < 375;

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
    paddingHorizontal: IS_SMALL_SCREEN ? 14 : 20,
    paddingBottom: 12,
    backgroundColor: DesignColors.text,
  },
  logo: {
    width: IS_SMALL_SCREEN ? 100 : 120,
    height: IS_SMALL_SCREEN ? 34 : 40,
  },
  iconButton: {
    padding: 4,
    width: IS_SMALL_SCREEN ? 28 : 30,
    alignItems: 'center',
  },
});
