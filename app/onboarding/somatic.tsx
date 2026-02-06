import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    interpolateColor, 
    runOnJS,
    useDerivedValue
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function SomaticEvent() {
  const router = useRouter();
  const { t } = useTranslation();
  const [completed, setCompleted] = useState(false);
  const { track } = useAnalytics();
  
  const progress = useSharedValue(0); // 0 -> 1

  const longPress = Gesture.LongPress()
    .minDuration(2000) // Hold for 2 seconds
    .onStart(() => {
        progress.value = withTiming(1, { duration: 2000 });
    })
    .onFinalize(() => {
        if (progress.value < 1) {
            progress.value = withTiming(0, { duration: 300 }); // Revert if released too early
        }
    });

  // Check completion
  useDerivedValue(() => {
      if (progress.value === 1 && !completed) {
          runOnJS(setCompleted)(true);
          runOnJS(track)('onboarding_somatic_complete');
          runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
      }
  });

  // Dynamic Background
  const animatedBg = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
          progress.value,
          [0, 1],
          ['#1C1917', '#F59E0B'] // Stone-900 -> Amber
      );
      return { backgroundColor };
  });

  return (
    <GestureDetector gesture={longPress}>
        <Animated.View style={[styles.container, animatedBg]}>
            {!completed ? (
                <View className="items-center px-8">
                     <Text className="text-white/60 text-sm uppercase tracking-widest mb-4">
                        {t('onboarding.somatic.intro')}
                     </Text>
                     <Text className="text-white text-3xl font-serif text-center leading-relaxed">
                        {t('onboarding.somatic.instruction')}
                     </Text>
                     
                     {/* Visual Ring Indicator */}
                     <View className="w-32 h-32 rounded-full border border-white/20 mt-12 justify-center items-center">
                         <Animated.View style={{ 
                             width: 100, 
                             height: 100, 
                             borderRadius: 50, 
                             backgroundColor: 'white', 
                             opacity: progress 
                         }} />
                     </View>
                </View>
            ) : (
                <View className="items-center px-8">
                    <Text className="text-black text-4xl font-serif text-center mb-8">
                        {t('onboarding.somatic.release')}
                    </Text>
                    <TouchableOpacity 
                        className="bg-black/10 border border-black/10 px-10 py-4 rounded-full"
                        onPress={() => router.push('/onboarding/personalization')}
                    >
                        <Text className="text-black font-bold uppercase tracking-widest">
                            {t('onboarding.continue')}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});