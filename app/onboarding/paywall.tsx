import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import GhostAvatar from '@/components/GhostAvatar';
import clsx from 'clsx';
import { PurchasesPackage } from 'react-native-purchases';

export default function Paywall() {
  const router = useRouter();
  const { setOnboarded, isSubscribed } = useStore();
  const { packages, isLoaded, purchasePackage, restorePermissions } = useRevenueCat();
  const [error, setError] = useState<string | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<PurchasesPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { t } = useTranslation();

  // If user is already subscribed, move them along
  useEffect(() => {
    if (isSubscribed) {
      setOnboarded(true);
      router.replace('/');
    }
  }, [isSubscribed]);

  // Select Annual by default when loaded
  useEffect(() => {
      if (packages.length > 0 && !selectedPkg) {
          const annual = packages.find(p => p.packageType === 'ANNUAL');
          setSelectedPkg(annual || packages[0]);
      }
  }, [packages]);

  const handlePurchase = async () => {
    if (!selectedPkg) return;
    
    setIsPurchasing(true);
    setError(null);
    try {
        await purchasePackage(selectedPkg);
        // If successful, the useEffect will trigger redirection
    } catch (e: any) {
        setError(t('paywall.error'));
    } finally {
        setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
      setIsPurchasing(true);
      await restorePermissions();
      setIsPurchasing(false);
  };

  if (!isLoaded) {
      return (
          <View className="flex-1 bg-stone-900 justify-center items-center">
              <ActivityIndicator color="#F59E0B" size="large" />
          </View>
      );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-stone-900">
      <View className="flex-1 justify-between p-6 pb-12">
          
          {/* Header & Ghost */}
          <View className="items-center pt-10">
              <Text className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-4">
                  {t('paywall.pro')}
              </Text>
              <Text className="text-white text-3xl font-serif text-center leading-tight mb-8">
                  {t('paywall.title')}
              </Text>
              
              {/* Hero Ghost: Vibrant Level 3 */}
              <View className="mb-8 scale-75">
                  <GhostAvatar level={3} mood={1} />
              </View>

              {/* Benefits */}
              <View className="w-full gap-4 mb-8">
                  {[t('paywall.benefit1'), t('paywall.benefit2'), t('paywall.benefit3')].map((benefit, i) => (
                      <Animated.View 
                        key={i} 
                        entering={FadeInUp.delay(i * 100)}
                        className="flex-row items-center bg-white/5 p-4 rounded-xl border border-white/10"
                      >
                          <View className="w-6 h-6 rounded-full bg-amber-500/20 items-center justify-center mr-4">
                              <Check size={14} color="#F59E0B" />
                          </View>
                          <Text className="text-white font-serif text-sm">{benefit}</Text>
                      </Animated.View>
                  ))}
              </View>
          </View>

          {/* Packages */}
          <View className="gap-4">
              {packages.map((pkg) => {
                  const isSelected = selectedPkg?.identifier === pkg.identifier;
                  const isAnnual = pkg.packageType === 'ANNUAL';
                  
                  return (
                      <TouchableOpacity 
                        key={pkg.identifier}
                        activeOpacity={0.9}
                        onPress={() => setSelectedPkg(pkg)}
                        className={clsx(
                            "flex-row justify-between items-center p-6 rounded-2xl border-2 transition-all",
                            isSelected ? "bg-white border-white" : "bg-white/5 border-transparent"
                        )}
                      >
                          <View>
                              <Text className={clsx("font-serif text-lg", isSelected ? "text-black" : "text-white")}>
                                  {isAnnual ? "Yearly" : "Monthly"}
                              </Text>
                              {isAnnual && (
                                  <View className="bg-amber-500 px-2 py-1 rounded mt-1 self-start">
                                      <Text className="text-[10px] font-bold text-black uppercase">
                                          {t('paywall.best_value')}
                                      </Text>
                                  </View>
                              )}
                          </View>
                          <View className="items-end">
                              <Text className={clsx("font-bold text-lg", isSelected ? "text-black" : "text-white")}>
                                  {pkg.product.priceString}
                              </Text>
                              <Text className={clsx("text-xs", isSelected ? "text-black/60" : "text-white/40")}>
                                  {isAnnual ? t('paywall.per_year') : t('paywall.per_month')}
                              </Text>
                          </View>
                      </TouchableOpacity>
                  )
              })}

              {/* Purchase Button */}
              <TouchableOpacity 
                className={clsx(
                    "w-full py-4 rounded-full items-center mt-4",
                    isPurchasing ? "bg-white/50" : "bg-amber-500"
                )}
                onPress={handlePurchase}
                disabled={isPurchasing || !selectedPkg}
              >
                {isPurchasing ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text className="text-black font-bold text-sm uppercase tracking-widest">
                        {selectedPkg?.product.introPrice ? t('paywall.subtitle') : t('paywall.button')}
                    </Text>
                )}
              </TouchableOpacity>

              {error && (
                <Text className="text-red-400 text-center text-xs px-4">{error}</Text>
              )}

              <TouchableOpacity onPress={handleRestore} disabled={isPurchasing}>
                  <Text className="text-white/30 text-center text-xs mt-2 uppercase tracking-widest">
                      {t('paywall.restore')}
                  </Text>
              </TouchableOpacity>
          </View>
      </View>
    </ScrollView>
  );
}