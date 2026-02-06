import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

const EXERCISES = [
    { id: 'box', name: 'Box Breathing', duration: '2m' },
    { id: 'scan', name: 'Body Scan', duration: '3m' },
    { id: 'calm', name: 'Immediate Calm', duration: '1m' },
];

export default function ResetLibrary() {
  const router = useRouter();
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-zinc-900 p-6 pt-10">
      {!activeExercise ? (
        <>
            <Text className="text-white text-2xl font-serif mb-8 mt-10">{t('reset.title')}</Text>
            <View className="gap-4">
                {EXERCISES.map((ex) => (
                    <TouchableOpacity 
                        key={ex.id}
                        className="bg-white/5 p-6 rounded-2xl border border-white/10 flex-row justify-between items-center active:bg-white/10"
                        onPress={() => setActiveExercise(ex.id)}
                    >
                        <Text className="text-white text-lg font-serif">{ex.name}</Text>
                        <Text className="text-white/30">{ex.duration}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity onPress={() => router.back()} className="mt-12 items-center">
                <Text className="text-white/30 uppercase tracking-widest text-xs">{t('home.close')}</Text>
            </TouchableOpacity>
        </>
      ) : (
          <ActiveSession onExit={() => setActiveExercise(null)} />
      )}
    </View>
  );
}

function ActiveSession({ onExit }: { onExit: () => void }) {
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.ease) }), 
                withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <View className="flex-1 justify-center items-center">
             <Animated.View 
                style={[
                    { width: 150, height: 150, borderRadius: 75, backgroundColor: '#fff', opacity: 0.2 },
                    animatedStyle
                ]}
             />
             <View className="absolute inset-0 justify-center items-center">
                 <Text className="text-white/50 font-serif mb-32">Breathe</Text>
             </View>
             
             <TouchableOpacity onPress={onExit} className="absolute bottom-10 p-4">
                 <Text className="text-white/50 text-sm uppercase tracking-widest">Stop</Text>
             </TouchableOpacity>
        </View>
    )
}
