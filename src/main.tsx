import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Capacitor imports
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

// Initialize Capacitor plugins
const initializeApp = async () => {
  if (Capacitor.isNativePlatform()) {
    // Configure status bar
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#1e40af' });
    
    // Hide splash screen after app loads
    await SplashScreen.hide();
  }
};

// Initialize app
initializeApp();

createRoot(document.getElementById("root")!).render(<App />);