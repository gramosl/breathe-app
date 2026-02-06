import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const HABITS = [
    "Walking",
    "Brushing Teeth",
    "Waiting in Line",
    "Drinking Coffee",
    "Commuting",
    "Waking Up"
];

export default function Personalization() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const { t } = useTranslation();

  const toggle = (habit: string) => {
      if (selected.includes(habit)) {
          setSelected(selected.filter(h => h !== habit));
      } else {
          if (selected.length < 3) {
            setSelected([...selected, habit]);
          }
      }
  };

  return (
    <View className="flex-1 bg-stone-900 pt-20 pb-10 px-6">
      <Text className="text-white text-2xl font-serif text-center mb-2">
        {t('onboarding.habit.title')}
      </Text>
      <Text className="text-white/50 text-base text-center mb-10">
        {t('onboarding.habit.subtitle')}
      </Text>

      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12 }}>
        {HABITS.map((habit) => {
            const isSelected = selected.includes(habit);
            return (
              <TouchableOpacity 
                key={habit}
                className={clsx(
                    "w-full p-6 rounded-2xl border transition-all duration-200",
                    isSelected ? "bg-white border-white" : "bg-white/5 border-white/10"
                )}
                onPress={() => toggle(habit)}
              >
                 <Text className={clsx(
                     "text-lg text-center font-serif tracking-wide",
                     isSelected ? "text-black" : "text-white"
                 )}>{habit}</Text>
              </TouchableOpacity>
            );
        })}
      </ScrollView>

      <TouchableOpacity 
        className={clsx(
            "w-full py-4 rounded-full mt-4 items-center",
            selected.length > 0 ? "bg-amber-500" : "bg-white/10"
        )}
        disabled={selected.length === 0}
        onPress={() => router.push('/onboarding/processing')}
      >
        <Text className={clsx(
            "font-semibold text-sm uppercase tracking-widest",
             selected.length > 0 ? "text-black" : "text-white/30"
        )}>{t('onboarding.continue')}</Text>
      </TouchableOpacity>
    </View>
  );
}
