import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';
import { eachDayOfInterval, startOfMonth, endOfMonth, format, isSameDay, parseISO } from 'date-fns';
import GhostAvatar from '@/components/GhostAvatar';
import clsx from 'clsx';

export default function HistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { history } = useStore();

  const today = new Date();
  const days = eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today)
  });

  return (
    <View className="flex-1 bg-stone-900 p-6 pt-12">
        <View className="flex-row justify-between items-center mb-8">
            <Text className="text-white text-2xl font-serif">{t('history.title', { defaultValue: 'My Journey' })}</Text>
            <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-white/30 uppercase tracking-widest text-xs">{t('settings.close')}</Text>
            </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap gap-2 justify-center">
            {days.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const status = history[dateKey]; // 'perfect' | 'partial' | undefined
                const isFuture = day > today;
                
                return (
                    <View key={dateKey} className="items-center mb-4" style={{ width: '13%' }}>
                        <View className={clsx(
                            "w-10 h-10 rounded-full justify-center items-center mb-1",
                            status === 'perfect' ? "bg-amber-500/20 border border-amber-500" :
                            status === 'partial' ? "bg-white/10 border border-white/20" :
                            isFuture ? "opacity-10" : "bg-black/20"
                        )}>
                            {/* Mini Ghost Representation */}
                            {status ? (
                                <View className={clsx(
                                    "w-4 h-4 rounded-full",
                                    status === 'perfect' ? "bg-amber-500 shadow-lg shadow-amber-500" : "bg-white/50"
                                )} />
                            ) : !isFuture && (
                                <View className="w-2 h-2 rounded-full bg-red-500/30" /> // Missed
                            )}
                        </View>
                        <Text className="text-white/20 text-[10px]">{format(day, 'd')}</Text>
                    </View>
                )
            })}
        </View>

        {/* Legend */}
        <View className="mt-12 gap-4 px-4">
            <View className="flex-row items-center gap-4">
                <View className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500 justify-center items-center">
                    <View className="w-4 h-4 rounded-full bg-amber-500" />
                </View>
                <Text className="text-white/60 text-sm">Grounded (3/3 Pulses)</Text>
            </View>
            <View className="flex-row items-center gap-4">
                <View className="w-8 h-8 rounded-full bg-white/10 border border-white/20 justify-center items-center">
                    <View className="w-4 h-4 rounded-full bg-white/50" />
                </View>
                <Text className="text-white/60 text-sm">Awakening (1-2 Pulses)</Text>
            </View>
        </View>
    </View>
  );
}
