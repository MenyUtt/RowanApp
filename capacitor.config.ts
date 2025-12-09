import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'rowan-app',
  webDir: 'dist/RowanApp/Browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
