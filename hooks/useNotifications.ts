import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const scheduleDailyPulse = async () => {
      // Cancel all existing to avoid spam
      await Notifications.cancelAllScheduledNotificationsAsync();

      // For demo: 10 seconds from now
      await Notifications.scheduleNotificationAsync({
          content: {
              title: "Body Pulse",
              body: "Can you feel your feet touching the floor right now?",
          },
          trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 10,
              repeats: false,
          },
      });
  };
  
  return { scheduleDailyPulse };
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
}
