import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createMMKV } from 'react-native-mmkv'
import { differenceInCalendarDays } from 'date-fns'

export const storage = createMMKV()

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
}

interface DailyPulses {
  morning: boolean;
  noon: boolean;
  evening: boolean;
}

type DayStatus = 'missed' | 'partial' | 'perfect';

interface AppState {
  hasOnboarded: boolean
  setOnboarded: (status: boolean) => void
  isSubscribed: boolean
  setSubscribed: (status: boolean) => void
  
  // New Pulse System
  lastCompletedDate: string | null // YYYY-MM-DD
  dailyPulses: DailyPulses
  history: Record<string, DayStatus> // YYYY-MM-DD -> Status
  
  streak: number
  ghostLevel: number // 1 = Glitch, 2 = Solid, 3 = Vibrant
  devOffset: number // To cycle challenges

  completePulse: (timeOfDay: keyof DailyPulses) => void
  resetDailyProgress: () => void // Dev tool / Midnight reset logic
  resetOnboarding: () => void
  
  sliderValue: number
  setSliderValue: (val: number) => void
}

const INITIAL_PULSES: DailyPulses = { morning: false, noon: false, evening: false };

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      setOnboarded: (status) => set({ hasOnboarded: status }),
      isSubscribed: false,
      setSubscribed: (status) => set({ isSubscribed: status }),
      
      lastCompletedDate: null,
      dailyPulses: INITIAL_PULSES,
      history: {},
      streak: 0,
      ghostLevel: 1,
      devOffset: 0,

      completePulse: (timeOfDay) => {
          const { streak, lastCompletedDate, dailyPulses, history } = get();
          const today = new Date().toISOString().split('T')[0];
          
          // Check if this is a new day reset
          let currentPulses = { ...dailyPulses };
          if (lastCompletedDate !== today) {
              currentPulses = { ...INITIAL_PULSES };
          }

          // Update Pulse
          currentPulses[timeOfDay] = true;

          // Calculate Status
          const doneCount = Object.values(currentPulses).filter(Boolean).length;
          const status: DayStatus = doneCount === 3 ? 'perfect' : 'partial';
          
          const newHistory = { ...history, [today]: status };

                    // Streak Logic: 
                    // We increment streak ONLY if this is the FIRST pulse completed today 
                    // AND the user completed at least one pulse yesterday (or streak is 0).
                    let newStreak = streak || 0; // Safety fallback
                    
                    if (lastCompletedDate !== today) {
                        // It's a new day. Did we keep the streak?
                        if (lastCompletedDate) {
                            const diff = differenceInCalendarDays(new Date(today), new Date(lastCompletedDate));
                            if (diff === 1) {
                                newStreak += 1;
                            } else if (diff > 1) {
                                newStreak = 1; // Reset
                            }
                        } else {
                            newStreak = 1; // First ever
                        }
                    }
          
                    // Ghost Evolution Logic
                    // Simple rule: Level up every 3 days of streak
                    // Ensure level is between 1 and 3
                    const rawLevel = Math.floor(newStreak / 3) + 1;
                    const newGhostLevel = Math.max(1, Math.min(3, isNaN(rawLevel) ? 1 : rawLevel));
          
                    set({
                        lastCompletedDate: today,
                        dailyPulses: currentPulses,
                        history: newHistory,
                        streak: newStreak,
                        ghostLevel: newGhostLevel
                    });
                },
      resetDailyProgress: () => set((state) => ({ 
          dailyPulses: INITIAL_PULSES, 
          lastCompletedDate: null,
          devOffset: state.devOffset + 1 // Rotate content
      })),
      
      resetOnboarding: () => set({ 
          hasOnboarded: false, 
          isSubscribed: false, 
          streak: 0, 
          ghostLevel: 1, 
          dailyPulses: INITIAL_PULSES,
          devOffset: 0
      }),
      
      sliderValue: 0.5,
      setSliderValue: (val) => set({ sliderValue: val }),
    }),
    {
      name: 'breathe-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
