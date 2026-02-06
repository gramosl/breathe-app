import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Commitment() {
  const router = useRouter();
  const { t } = useTranslation();
  const { track } = useAnalytics();

  return (
    <View className="flex-1 bg-stone-900 justify-center items-center p-8">
      <Text className="text-white/50 text-sm uppercase tracking-widest mb-8 text-center">
          {t('onboarding.commitment.header', { defaultValue: 'One Last Thing' })}
      </Text>

      <Text className="text-white text-3xl font-serif text-center leading-relaxed mb-12">
          {t('onboarding.commitment.title', { defaultValue: 'Can you commit 3 minutes a day to your nervous system?' })}
      </Text>

      <Animated.View entering={FadeInDown.delay(500).springify()} className="w-full">
          <TouchableOpacity 
            className="w-full bg-white py-4 rounded-full items-center mb-4"
            onPress={() => {
                track('onboarding_commitment_yes');
                router.push('/onboarding/paywall');
            }}
          >
            <Text className="text-black font-bold text-sm uppercase tracking-widest">
                {t('onboarding.commitment.yes', { defaultValue: 'Yes, I commit' })}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => {
              track('onboarding_commitment_no');
              router.push('/onboarding/paywall');
          }}>
              <Text className="text-white/30 text-center text-xs uppercase tracking-widest">
                  {t('onboarding.commitment.no', { defaultValue: 'Not right now' })}
              </Text>
          </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
