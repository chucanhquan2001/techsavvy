/**
 * Visit Tracking Type Definitions
 */

export interface VisitData {
  id: number;
  ip_address: string;
  user_agent: string;
  referer: string;
  full_url: string;
  device_type: string;
  browser: string;
  browser_version: string;
  platform: string;
  platform_version: string | null;
  country_code: string | null;
  country_name: string | null;
  fbclid: string | null;
  gclid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrackVisitResponse {
  success: boolean;
  message: string;
  data?: VisitData;
  errors?: string[];
}

export interface UseTrackVisitReturn {
  track: () => Promise<TrackVisitResponse | null>;
  isTracking: boolean;
  lastVisit: VisitData | null;
}
