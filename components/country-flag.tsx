import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { getTeamImage } from '@/utils/team-images';

interface CountryFlagProps {
  countryCode: string;
  countryName: string;
  flagSize?: number;
  align?: 'left' | 'center' | 'right';
  showName?: boolean;
  namePosition?: 'below' | 'beside';
  reverseOrder?: boolean; // For away teams: show name first, then logo
}

export function CountryFlag({ 
  countryCode, 
  countryName, 
  flagSize = 40, 
  align = 'center',
  showName = true,
  namePosition = 'beside',
  reverseOrder = false
}: CountryFlagProps) {
  const flagImage = getTeamImage(countryCode);

  const alignStyle = {
    left: styles.alignLeft,
    center: styles.alignCenter,
    right: styles.alignRight,
  }[align];

  const containerDirection = namePosition === 'beside' ? styles.horizontalContainer : styles.verticalContainer;
  const reverseStyle = reverseOrder ? styles.reverseOrder : null;

  const flagElement = (
    <View style={[styles.flagContainer, { width: flagSize, height: flagSize }]}>
      <Image 
        source={flagImage} 
        style={styles.flag} 
        contentFit="cover"
        transition={200}
      />
    </View>
  );

  const nameElement = showName && (
    <Text 
      style={[
        styles.countryName, 
        alignStyle,
        namePosition === 'beside' ? styles.nameBeside : styles.nameBelow,
        reverseOrder && namePosition === 'beside' ? styles.nameBefore : null
      ]} 
      numberOfLines={2} 
      ellipsizeMode="tail"
    >
      {countryName}
    </Text>
  );

  return (
    <View style={[styles.container, alignStyle, containerDirection, reverseStyle]}>
      {reverseOrder ? (
        <>
          {nameElement}
          {flagElement}
        </>
      ) : (
        <>
          {flagElement}
          {nameElement}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  reverseOrder: {
    flexDirection: 'row-reverse',
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  alignCenter: {
    justifyContent: 'center',
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
  flagContainer: {
    borderRadius: 999, // Makes it circular
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    flexShrink: 0, // Prevents flag from shrinking
  },
  flag: {
    width: '100%',
    height: '100%',
  },
  countryName: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  nameBeside: {
    marginLeft: 8,
    textAlign: 'left',
    maxWidth: 100,
    flex: 1,
  },
  nameBefore: {
    marginLeft: 0,
    marginRight: 8,
    textAlign: 'right',
    maxWidth: 100,
    flex: 1,
  },
  nameBelow: {
    textAlign: 'center',
    maxWidth: 80,
  },
});
