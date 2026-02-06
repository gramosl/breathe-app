import { usePostHog } from 'posthog-react-native';
import { useCallback } from 'react';

export function useAnalytics() {
  const posthog = usePostHog();

  const track = useCallback((event: string, properties?: Record<string, any>) => {
    if (posthog) {
      posthog.capture(event, properties);
    }
  }, [posthog]);

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
      if (posthog) {
          posthog.identify(userId, traits);
      }
  }, [posthog]);

  return { track, identify };
}
