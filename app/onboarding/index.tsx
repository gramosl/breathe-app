import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    withSequence,
    Easing, 
    useDerivedValue,
    interpolate
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalytics } from '@/hooks/useAnalytics';

const { width } = Dimensions.get('window');

export default function OnboardingGhost() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [interacted, setInteracted] = useState(false);
  const { track } = useAnalytics();

  useEffect(() => {
      track('onboarding_start');
  }, []);

  // Animation values
  const float = useSharedValue(0);
  const glitch = useSharedValue(0);

  // Start floating loop
  useDerivedValue(() => {
      float.value = withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
      );
  });

  const handleTap = () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); // Glitchy feel
      if (!interacted) {
          track('onboarding_ghost_tap');
      }
      setInteracted(true);
      
      // Glitch animation: rapid shake
      glitch.value = withSequence(
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(0, { duration: 50 })
      );
  };

  const toggleLanguage = () => {
      const newLang = i18n.language === 'es' ? 'en' : 'es';
      i18n.changeLanguage(newLang);
  };

  const ghostStyle = useAnimatedStyle(() => {
      return {
          transform: [
              { translateY: interpolate(float.value, [0, 1], [-10, 10]) },
              { translateX: glitch.value }
          ],
          opacity: withTiming(interacted ? 0.8 : 0.4)
      };
  });

  return (
    <View className="flex-1 bg-stone-900 justify-center items-center p-6">
      <SafeAreaView className="absolute top-0 right-0 p-4 z-50">
          <TouchableOpacity onPress={toggleLanguage} className="bg-white/10 p-2 rounded-full">
              <Text className="text-xl">{i18n.language === 'es' ? '🇺🇸' : '🇪🇸'}</Text>
          </TouchableOpacity>
      </SafeAreaView>
      
      {/* The Ghost Blob */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleTap}>
          <Animated.View 
            style={[
                { width: 150, height: 160, borderRadius: 80, backgroundColor: '#fff' }, // White blob
                ghostStyle
            ]} 
            className="mb-12 shadow-2xl shadow-white/20 blur-xl"
          >
              {/* Eyes */}
              <View className="absolute top-12 left-10 w-3 h-3 bg-black rounded-full opacity-60" />
              <View className="absolute top-12 right-10 w-3 h-3 bg-black rounded-full opacity-60" />
          </Animated.View>
      </TouchableOpacity>

      <Text className="text-white text-3xl font-serif text-center mb-4 leading-relaxed">
        {t('onboarding.hook')}
      </Text>
      
      {!interacted && (
          <Text className="text-white/30 text-sm uppercase tracking-widest absolute bottom-20">
              {t('onboarding.ghost_hint')}
          </Text>
      )}

      {interacted && (
          <TouchableOpacity 
            className="bg-white px-10 py-4 rounded-full mt-8"
            onPress={() => router.push('/onboarding/check')}
          >
            <Text className="text-black font-bold text-sm uppercase tracking-widest">
                {t('onboarding.begin')}
            </Text>
          </TouchableOpacity>
      )}
    </View>
  );
}
