import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import clsx from 'clsx';
import { useStore } from '@/store/useStore';

export default function Settings() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { resetDailyProgress, resetOnboarding } = useStore();

  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View className="flex-1 bg-stone-900 p-6 pt-10">
      <Text className="text-white text-2xl font-serif mb-8 mt-10">{t('settings.title')}</Text>
      
      <View className="mb-8">
          <Text className="text-white/50 text-xs uppercase tracking-widest mb-4">{t('settings.language')}</Text>
          <View className="gap-3">
              <TouchableOpacity 
                className={clsx(
                    "flex-row justify-between items-center p-5 rounded-2xl border transition-all",
                    currentLang === 'en' ? "bg-white border-white" : "bg-white/5 border-white/10"
                )}
                onPress={() => changeLanguage('en')}
              >
                  <Text className={clsx("font-serif text-lg", currentLang === 'en' ? "text-black" : "text-white")}>English</Text>
                  {currentLang === 'en' && <Check size={20} color="black" />}
              </TouchableOpacity>

              <TouchableOpacity 
                className={clsx(
                    "flex-row justify-between items-center p-5 rounded-2xl border transition-all",
                    currentLang === 'es' ? "bg-white border-white" : "bg-white/5 border-white/10"
                )}
                onPress={() => changeLanguage('es')}
              >
                  <Text className={clsx("font-serif text-lg", currentLang === 'es' ? "text-black" : "text-white")}>Español</Text>
                  {currentLang === 'es' && <Check size={20} color="black" />}
              </TouchableOpacity>
          </View>
      </View>
        
      {/* Dev Tools Section */}
      <View className="mb-8 gap-4">
         <Text className="text-white/50 text-xs uppercase tracking-widest mb-0">{t('settings.dev_tools')}</Text>
         
         <TouchableOpacity 
            className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
            onPress={() => {
                resetDailyProgress();
                router.back();
            }}
         >
             <Text className="text-red-400 font-serif text-center">{t('settings.reset_daily')}</Text>
         </TouchableOpacity>

         <TouchableOpacity 
            className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
            onPress={() => {
                resetOnboarding();
                router.replace('/onboarding');
            }}
         >
             <Text className="text-red-400 font-serif text-center">{t('settings.reset_full')}</Text>
         </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()} className="mt-auto items-center mb-8">
          <Text className="text-white/30 uppercase tracking-widest text-xs">{t('settings.close')}</Text>
      </TouchableOpacity>
    </View>
  );
}
