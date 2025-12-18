import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zent.app',
  appName: 'Zent',
  webDir: 'out',
  server: {
    // Corrected based on your 'npm run dev' output
    url: 'http://192.168.0.201:3000',
    cleartext: true
  }
};

export default config;
