import '../global.css';
import '@/i18n'; // Init i18n
import { Stack } from 'expo-router';
import { PostHogProvider } from 'posthog-react-native';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRevenueCat } from '@/hooks/useRevenueCat';

export default function RootLayout() {
  useRevenueCat();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostHogProvider 
        apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY || 'phc_PLACEHOLDER_KEY'}
        options={{
          host: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="challenge" options={{ presentation: 'modal' }} />
            <Stack.Screen name="reset" options={{ presentation: 'modal' }} />
            <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
            <Stack.Screen name="sos" options={{ presentation: 'modal', gestureEnabled: false }} />
            <Stack.Screen name="history" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="light" />
        </View>
      </PostHogProvider>
    </GestureHandlerRootView>
  );
}