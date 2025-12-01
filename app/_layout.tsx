import { useAppSelector } from '@/hooks/redux';
import { ClerkAndConvexProvider } from '@/providers/clerk-convex-provider';
import { store } from '@/store/store';
import { useAuth } from '@clerk/clerk-expo';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import './global.css';

export const unstable_settings = {
  anchor: '(home)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const theme = useAppSelector((state) => state.theme.theme);
  const { isLoaded } = useAuth();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  return (
    <NavigationThemeProvider
      value={theme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(home)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Toast />
      </SafeAreaProvider>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ClerkAndConvexProvider>
        <RootLayoutNav />
      </ClerkAndConvexProvider>
    </Provider>
  );
}
