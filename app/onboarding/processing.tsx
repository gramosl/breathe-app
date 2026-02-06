import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    Easing 
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

export default function Processing() {
  const router = useRouter();
  const scale = useSharedValue(1);
  const { t } = useTranslation();

  useEffect(() => {
    scale.value = withRepeat(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }), 
        -1, 
        true
    );

    const timer = setTimeout(() => {
        router.replace('/onboarding/commitment');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
  }));

  return (
    <View className="flex-1 bg-stone-900 justify-center items-center p-8">
      <Animated.View 
        style={[
            { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F59E0B' }, 
            animatedStyle
        ]} 
        className="mb-12 shadow-2xl shadow-amber-500/50"
      />

      <Text className="text-white text-xl font-serif text-center leading-relaxed">
        {t('onboarding.processing')}
      </Text>
    </View>
  );
}
