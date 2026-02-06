import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import PurchasesUI from 'react-native-purchases-ui';
import { useStore } from '@/store/useStore';

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || "rc_PLACEHOLDER_KEY",
  google: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || "rc_PLACEHOLDER_KEY",
};

export function useRevenueCat() {
  const { setSubscribed } = useStore();
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: APIKeys.google });
        } else {
          await Purchases.configure({ apiKey: APIKeys.apple });
        }

        // Check initial subscription status
        const customerInfo = await Purchases.getCustomerInfo();
        const hasEntitlement = typeof customerInfo.entitlements.active['Breath Pro'] !== "undefined" || 
                               typeof customerInfo.entitlements.active['breath_pro'] !== "undefined";

        if (hasEntitlement) {
            setSubscribed(true);
        } else {
            setSubscribed(false);
        }

        // Load Offerings
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
          setCurrentOffering(offerings.current);
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        console.log("RevenueCat Error:", e);
      } finally {
        setIsLoaded(true);
      }
    };

    init();
  }, [setSubscribed]);

  const restorePermissions = async () => {
      try {
          const customerInfo = await Purchases.restorePurchases();
          const hasEntitlement = typeof customerInfo.entitlements.active['Breath Pro'] !== "undefined" || 
                                 typeof customerInfo.entitlements.active['breath_pro'] !== "undefined";
          
          if (hasEntitlement) {
              setSubscribed(true);
              return true;
          }
      } catch (e) {
          console.error("Restore Error:", e);
      }
      return false;
  };

  const purchasePackage = async (pkg: PurchasesPackage) => {
      try {
          const { customerInfo } = await Purchases.purchasePackage(pkg);
          const hasEntitlement = typeof customerInfo.entitlements.active['Breath Pro'] !== "undefined" || 
                                 typeof customerInfo.entitlements.active['breath_pro'] !== "undefined";
          
          if (hasEntitlement) {
              setSubscribed(true);
              return true;
          }
      } catch (e: any) {
          if (!e.userCancelled) {
              console.error("Purchase Error:", e);
              throw e;
          }
      }
      return false;
  };

  return { packages, isLoaded, restorePermissions, purchasePackage };
}