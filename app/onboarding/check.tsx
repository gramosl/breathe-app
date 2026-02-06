import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AddictionCheck() {
  const router = useRouter();
  const { t } = useTranslation();
  const { track } = useAnalytics();

  // Keys must match i18n/index.ts exactly
  const OPTIONS = [
      { label: t('onboarding.options.rarely'), delay: 100, id: 'rarely' },
      { label: t('onboarding.options.often'), delay: 200, id: 'often' },
      { label: t('onboarding.options.always'), delay: 300, id: 'always' }
  ];

  return (
    <View className="flex-1 bg-stone-900 justify-center items-center p-8">
      <Text className="text-white text-2xl font-serif text-center mb-4 leading-relaxed">
        {t('onboarding.check_title')}
      </Text>
      
      <Text className="text-white/50 text-base text-center mb-12">
        {t('onboarding.check_subtitle')}
      </Text>

      <View className="w-full gap-4">
        {OPTIONS.map((opt, index) => (
          <Animated.View key={index} entering={FadeInDown.delay(opt.delay).springify()}>
              <TouchableOpacity 
                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl active:bg-white/10"
                onPress={() => {
                    track('onboarding_check_answer', { answer: opt.id });
                    router.push('/onboarding/somatic');
                }}
              >
                 <Text className="text-white text-lg text-center font-serif tracking-wide">{opt.label}</Text>
              </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}