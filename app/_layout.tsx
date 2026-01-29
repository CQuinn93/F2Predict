import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/utils/supabase';
import { DesignColors } from '@/constants/design-colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Ethnocentric: require('../assets/fonts/Ethnocentric.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        // If user is logged in, check and update ante-post locked status
        if (session?.user) {
          try {
            const { updateAntePostLockedStatus } = await import('@/services/async-predictions');
            await updateAntePostLockedStatus(session.user.id);
          } catch (error) {
            console.error('Error updating ante post locked status on initial check:', error);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
      
      // When user logs in, check and update ante-post locked status
      if (session?.user) {
        try {
          const { updateAntePostLockedStatus } = await import('@/services/async-predictions');
          await updateAntePostLockedStatus(session.user.id);
        } catch (error) {
          console.error('Error updating ante post locked status on auth change:', error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!fontsLoaded || isAuthenticated === null) {
      return;
    }

    const currentRoute = segments[0];
    const inAuthGroup = currentRoute === 'login' || currentRoute === 'signup';
    const onIndexRoute = !currentRoute || currentRoute === 'index' || segments.length === 0;
    
    if (isAuthenticated) {
      // User is authenticated
      if (inAuthGroup || onIndexRoute) {
        // User is authenticated but on auth screen or index, redirect to home
        router.replace('/(tabs)');
      }
    } else {
      // User is not authenticated
      if (!inAuthGroup && !onIndexRoute) {
        // User is not authenticated and not on auth screen or index, redirect to login
        router.replace('/login');
      } else if (onIndexRoute) {
        // User is on index route but not authenticated, redirect to login
        router.replace('/login');
      }
    }
  }, [isAuthenticated, segments, fontsLoaded]);

  if (!fontsLoaded || isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color={DesignColors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Quick Access' }} />
        <Stack.Screen name="ante-post-navigation" options={{ headerShown: false }} />
        <Stack.Screen name="ante-post-selections" options={{ headerShown: false }} />
        <Stack.Screen name="round-of-32-results" options={{ headerShown: false }} />
        <Stack.Screen name="round-of-32-predictions" options={{ headerShown: false }} />
        <Stack.Screen name="round-of-16-results" options={{ headerShown: false }} />
        <Stack.Screen name="round-of-16-predictions" options={{ headerShown: false }} />
        <Stack.Screen name="quarter-finals-results" options={{ headerShown: false }} />
        <Stack.Screen name="quarter-finals-predictions" options={{ headerShown: false }} />
        <Stack.Screen name="semi-finals-results" options={{ headerShown: false }} />
        <Stack.Screen name="semi-finals-predictions" options={{ headerShown: false }} />
        <Stack.Screen name="bronze-final-results" options={{ headerShown: false }} />
        <Stack.Screen name="bronze-final-predictions" options={{ headerShown: false }} />
        <Stack.Screen name="final-predictions" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
