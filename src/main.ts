import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { trackVisit } from '@/services/trackVisit'
import { apiConfig } from '@/config/api'

// Track user visit when app loads
// Using sendBeacon for better reliability (non-blocking)
if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
  // Prepare data for beacon
  const data = JSON.stringify({});

  // Use sendBeacon for analytics - won't block page unload
  const beaconUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.trackVisit}`;
  navigator.sendBeacon(beaconUrl, data);
} else {
  // Fallback to regular fetch
  trackVisit();
}

createApp(App).mount('#app')
