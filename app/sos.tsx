import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { getDailyPractice } from '@/constants/practices';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function SOSScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const scale = useSharedValue(1);
  const { track } = useAnalytics();
  
  // Get a random SOS practice
  const [practice] = useState(() => getDailyPractice(new Date().toISOString(), i18n.language as 'en' | 'es', 'sos' + Date.now()));

  useEffect(() => {
      track('sos_trigger', { title: practice.title });
  }, []);

  // Breathing Loop (Generic slow pulse for grounding)
  useEffect(() => {
      const breathe = async () => {
          while (true) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              scale.value = withTiming(1.2, { duration: 4000, easing: Easing.inOut(Easing.ease) });
              await new Promise(r => setTimeout(r, 4000));

              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              scale.value = withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) });
              await new Promise(r => setTimeout(r, 4000));
          }
      };
      breathe();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
  }));

  return (
    <View className="flex-1 bg-red-950 justify-center items-center px-6">
        <View className="absolute inset-0 bg-black/40" />
        
        {/* Pulsing Anchor */}
        <Animated.View 
            style={[
                { width: 300, height: 300, borderRadius: 150, backgroundColor: '#fff', opacity: 0.05, position: 'absolute' }, 
                animatedStyle
            ]} 
        />
        
        <View className="items-center z-10">
            <Text className="text-red-400 text-xs uppercase tracking-widest mb-8 font-bold">SOS Anchor</Text>
            
            <Text className="text-white text-3xl font-serif text-center leading-tight mb-6">
                {practice.title}
            </Text>
            
            <Text className="text-white/80 text-xl font-serif text-center leading-relaxed">
                "{practice.description}"
            </Text>
        </View>

        <TouchableOpacity 
            className="absolute bottom-12 bg-white/10 px-8 py-4 rounded-full border border-white/20"
            onPress={() => router.back()}
        >
            <Text className="text-white font-bold text-sm">I'm Grounded</Text>
        </TouchableOpacity>
    </View>
  );
}
