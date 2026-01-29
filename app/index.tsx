import { View, ActivityIndicator } from 'react-native';
import { DesignColors } from '@/constants/design-colors';

export default function Index() {
  // Root layout handles auth routing, just show loading
  // This screen will be immediately redirected by _layout.tsx
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      <ActivityIndicator size="large" color={DesignColors.primary} />
    </View>
  );
}
