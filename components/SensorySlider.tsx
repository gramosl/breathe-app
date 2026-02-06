import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolateColor, 
  runOnJS,
  withSpring,
  useDerivedValue
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '@/hooks/useAnalytics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SLIDER_HEIGHT = SCREEN_HEIGHT * 0.6;
const SLIDER_WIDTH = 80;

export default function SensorySlider() {
  const { setSliderValue } = useStore();
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const progress = useSharedValue(0.5); // 0 to 1
  const prevHapticValue = useSharedValue(0.5);

  const context = useSharedValue(0);

  const handleEnd = (val: number) => {
      setSliderValue(val);
      track('slider_update', { value: val });
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = progress.value;
    })
    .onUpdate((e) => {
      // Invert Y because dragging up should increase value? 
      // Usually sliders: Up = High value (1), Down = Low value (0).
      // DeltaY is negative when going up.
      
      const change = -e.translationY / SLIDER_HEIGHT;
      let newValue = context.value + change;
      
      // Clamp
      if (newValue < 0) newValue = 0;
      if (newValue > 1) newValue = 1;
      
      progress.value = newValue;
    })
    .onEnd(() => {
        runOnJS(handleEnd)(progress.value);
    });

  // Haptics logic
  useDerivedValue(() => {
      const diff = Math.abs(progress.value - prevHapticValue.value);
      if (diff > 0.05) { // Trigger every 5%
          runOnJS(Haptics.selectionAsync)();
          prevHapticValue.value = progress.value;
      }
  });

  const animatedBgStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#52525B', '#F59E0B'] // Zinc-600 to Amber-500
    );
    return { backgroundColor };
  });

  const animatedFillStyle = useAnimatedStyle(() => {
      return {
          height: withSpring(progress.value * SLIDER_HEIGHT, { damping: 50, stiffness: 200 }),
      };
  });

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
        <View style={{ position: 'absolute', top: '10%', width: '100%', alignItems: 'center' }}>
             <Text className="text-white/50 font-serif text-xs tracking-widest uppercase">{t('slider.vibrant')}</Text>
        </View>

        <GestureDetector gesture={pan}>
            <View style={styles.sliderTrack}>
                {/* Background of track */}
                <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="light" />
                
                {/* Fill */}
                <Animated.View style={[styles.sliderFill, animatedFillStyle]} />
            </View>
        </GestureDetector>

        <View style={{ position: 'absolute', bottom: '15%', width: '100%', alignItems: 'center' }}>
             <Text className="text-white/50 font-serif text-xs tracking-widest uppercase">{t('slider.numb')}</Text>
        </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderTrack: {
        width: SLIDER_WIDTH,
        height: SLIDER_HEIGHT,
        borderRadius: SLIDER_WIDTH / 2,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'flex-end', // Fill from bottom
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    sliderFill: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: SLIDER_WIDTH / 2,
    }
});
