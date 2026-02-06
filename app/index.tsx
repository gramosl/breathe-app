import { Redirect } from 'expo-router';
import { View, TouchableOpacity, Text, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { useStore } from '@/store/useStore';
import GhostAvatar from '@/components/GhostAvatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect, useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Settings as SettingsIcon, Flame, Check, Lock, Sun, Moon, Sunrise, LifeBuoy } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAnalytics } from '@/hooks/useAnalytics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Sanctuary() {
  const { hasOnboarded, isSubscribed, streak, ghostLevel, sliderValue, dailyPulses } = useStore();
  const router = useRouter();
  const { scheduleDailyPulse } = useNotifications();
  const { t } = useTranslation();
  const { track } = useAnalytics();

  // Determine current time of day for unlocking
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    if (hasOnboarded) {
        track('app_open', { streak, ghostLevel });
        // scheduleDailyPulse(); 
    }
  }, [hasOnboarded]);

  if (!hasOnboarded) return <Redirect href="/onboarding" />;
  if (!isSubscribed) return <Redirect href="/onboarding/paywall" />;

  const isMorningUnlocked = true; 
  const isNoonUnlocked = currentHour >= 11;
  const isEveningUnlocked = currentHour >= 17;

  return (
    <View className="flex-1 bg-[#1C1917]">
        <SafeAreaView className="flex-1 justify-between pb-8">
            
            {/* Top Bar */}
            <View className="flex-row justify-between items-center px-6 pt-4">
                {/* SOS (Left) */}
                <TouchableOpacity 
                    onPress={() => router.push('/sos')} 
                    className="p-2 bg-red-500/10 rounded-full border border-red-500/20"
                >
                    <LifeBuoy size={20} color="#EF4444" />
                </TouchableOpacity>

                {/* Streak (Center) */}
                <TouchableOpacity 
                    className="flex-row items-center bg-white/10 px-4 py-2 rounded-full border border-white/5"
                    onPress={() => {
                        track('streak_view');
                        router.push('/history');
                    }}
                >
                    <Flame size={16} color={ghostLevel > 1 ? "#F59E0B" : "#fff"} fill={ghostLevel > 1 ? "#F59E0B" : "transparent"} />
                    <Text className="text-white font-serif ml-2 text-xs tracking-widest uppercase">
                        {t('home.streak', { count: streak })}
                    </Text>
                </TouchableOpacity>

                {/* Settings (Right) */}
                <TouchableOpacity onPress={() => router.push('/settings')} className="p-2 bg-white/5 rounded-full border border-white/5">
                    <SettingsIcon size={20} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
            </View>

            {/* Center: The Ghost */}
            <View className="items-center justify-center -mt-20">
                <GhostAvatar level={ghostLevel} mood={sliderValue} />
                <Text className="text-white/30 text-xs uppercase tracking-[0.2em] mt-8">
                    {ghostLevel === 1 ? t('home.ghost.1') : ghostLevel === 2 ? t('home.ghost.2') : t('home.ghost.3')}
                </Text>
            </View>

            {/* Bottom: The Timeline */}
            <View className="px-6">
                <Text className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase mb-6 text-center">
                    {t('home.daily_rhythm')}
                </Text>
                
                <View className="flex-row justify-between gap-3">
                    <PulseCard 
                        icon={<Sunrise size={24} color={dailyPulses.morning ? "#000" : "#fff"} />}
                        label={t('home.time.morning')}
                        isDone={dailyPulses.morning}
                        isLocked={!isMorningUnlocked}
                        onPress={() => router.push({ pathname: '/challenge', params: { type: 'morning' } })}
                    />
                    <PulseCard 
                        icon={<Sun size={24} color={dailyPulses.noon ? "#000" : "#fff"} />}
                        label={t('home.time.noon')}
                        isDone={dailyPulses.noon}
                        isLocked={!isNoonUnlocked}
                        onPress={() => router.push({ pathname: '/challenge', params: { type: 'noon' } })}
                    />
                    <PulseCard 
                        icon={<Moon size={24} color={dailyPulses.evening ? "#000" : "#fff"} />}
                        label={t('home.time.evening')}
                        isDone={dailyPulses.evening}
                        isLocked={!isEveningUnlocked}
                        onPress={() => router.push({ pathname: '/challenge', params: { type: 'evening' } })}
                    />
                </View>
            </View>

        </SafeAreaView>
    </View>
  );
}

function PulseCard({ icon, label, isDone, isLocked, onPress }: any) {
    return (
        <TouchableOpacity 
            className={clsx(
                "flex-1 aspect-[3/4] rounded-3xl justify-center items-center border transition-all",
                isDone ? "bg-amber-500 border-amber-500" : 
                isLocked ? "bg-white/5 border-transparent" : "bg-white/10 border-white/20"
            )}
            disabled={isLocked}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className="flex-1 justify-center items-center">
                {isDone ? (
                    <Check size={32} color="#000" />
                ) : isLocked ? (
                    <Lock size={20} color="rgba(255,255,255,0.2)" />
                ) : (
                    <View className="items-center gap-2">
                        {icon}
                    </View>
                )}
            </View>
            
            <Text className={clsx(
                "absolute bottom-4 text-[10px] uppercase tracking-widest font-bold",
                isDone ? "text-black/60" : isLocked ? "text-white/20" : "text-white/60"
            )}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}
