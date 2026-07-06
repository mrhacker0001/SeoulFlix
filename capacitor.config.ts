import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uz.seoulflix.app',
  appName: 'SeoulFlix',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;