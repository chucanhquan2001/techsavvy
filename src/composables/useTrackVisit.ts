/**
 * Use Track Visit Composable
 * Vue 3 composable for tracking user visits
 */

import { ref } from 'vue';
import { trackVisit as trackVisitService } from '@/services/trackVisit';
import type { UseTrackVisitReturn, TrackVisitResponse, VisitData } from '@/types/trackVisit';

/**
 * Composable for tracking user visits
 * @returns Object with track function and state
 */
export function useTrackVisit(): UseTrackVisitReturn {
  const isTracking = ref(false);
  const lastVisit = ref<VisitData | null>(null);

  const track = async (): Promise<TrackVisitResponse | null> => {
    if (isTracking.value) {
      console.warn('[useTrackVisit] Already tracking, skipping...');
      return null;
    }

    isTracking.value = true;

    try {
      const response = await trackVisitService();

      if (response?.success && response.data) {
        lastVisit.value = response.data;
      }

      return response;
    } catch (error) {
      console.error('[useTrackVisit] Error:', error);
      return null;
    } finally {
      isTracking.value = false;
    }
  };

  return {
    track,
    isTracking: isTracking.value,
    lastVisit: lastVisit.value,
  };
}
