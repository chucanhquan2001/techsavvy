/**
 * Visit Tracking Service
 * Calls POST /api/track-visit to track user visits
 * Server automatically collects IP, user agent, UTM params from request
 */

import { apiClient } from './apiClient';
import { apiConfig } from '@/config/api';
import type { TrackVisitResponse } from '@/types/trackVisit';

/**
 * Track a user visit to the website
 * @returns Promise with the response data or null if failed
 */
export async function trackVisit(): Promise<TrackVisitResponse | null> {
  try {
    const response = await apiClient.post<TrackVisitResponse>(
      apiConfig.endpoints.trackVisit
    );

    if (response.success) {
      console.log(
        '[TrackVisit] Visit tracked successfully:',
        response.data?.id
      );
    } else {
      console.warn('[TrackVisit] Track failed:', response.message);
    }

    return response;
  } catch (error) {
    console.warn('[TrackVisit] Error tracking visit:', error);
    return null;
  }
}
