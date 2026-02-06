import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { getDailyPractice } from '@/constants/practices';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function DailyChallenge() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'morning' | 'noon' | 'evening' }>();
  const { completePulse, devOffset } = useStore();
  const [completed, setCompleted] = useState(false);
  const { t, i18n } = useTranslation();
  const { track } = useAnalytics();

  // Get dynamic practice based on Date + Time of Day + Dev Offset
  const today = new Date().toISOString().split('T')[0];
  const practice = getDailyPractice(today, i18n.language as 'en' | 'es', (type || '') + devOffset);

  const handleComplete = () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCompleted(true);
      
      track('pulse_complete', { type, title: practice.title });

      if (type) {
          completePulse(type);
      }
      
      setTimeout(() => {
          router.back();
      }, 2000);
  };

  if (completed) {
      return (
          <View className="flex-1 bg-amber-500 justify-center items-center">
              <Animated.View entering={ZoomIn.springify()} className="items-center">
                  <Text className="text-black text-6xl font-serif mb-4">✓</Text>
                  <Text className="text-black/50 font-serif uppercase tracking-widest">{t('challenge.pulse_recorded')}</Text>
              </Animated.View>
          </View>
      );
  }

  return (
    <View className="flex-1 bg-stone-900 p-6 pt-20">
      <View className="flex-1 justify-center">
        <Text className="text-white/50 text-sm uppercase tracking-widest mb-4 font-semibold text-center">
            {type ? t(`home.time.${type}`).toUpperCase() : "FOCUS"}
        </Text>
        <Text className="text-white text-3xl font-serif text-center leading-relaxed mb-8">
            {practice.title}
        </Text>
        <Text className="text-white/80 text-xl font-serif text-center leading-relaxed px-4">
            "{practice.description}"
        </Text>
      </View>

      <TouchableOpacity 
        className="w-full bg-white py-6 rounded-full items-center mb-10"
        onPress={handleComplete}
      >
        <Text className="text-black font-bold text-lg uppercase tracking-widest">{t('challenge.done')}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()} className="absolute top-4 right-4 p-4">
          <Text className="text-white/30">{t('challenge.close')}</Text>
      </TouchableOpacity>
    </View>
  );
}
