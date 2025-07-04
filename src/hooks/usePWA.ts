import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

interface PWAStatus {
  canInstall: boolean;
  isInstalled: boolean;
  needsUpdate: boolean;
}

export const usePWA = () => {
  const [status, setStatus] = useState<PWAStatus>({
    canInstall: false,
    isInstalled: false,
    needsUpdate: false
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [updateSW, setUpdateSW] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    // Register service worker with auto update
    const { updateSW } = registerSW({
      onNeedRefresh() {
        setStatus(prev => ({ ...prev, needsUpdate: true }));
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });
    setUpdateSW(() => updateSW);

    // Check if app is installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setStatus(prev => ({ ...prev, isInstalled: true }));
      }
    };
    checkInstalled();

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStatus(prev => ({ ...prev, canInstall: true }));
    });

    // Listen for app install
    window.addEventListener('appinstalled', () => {
      setStatus(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      setDeferredPrompt(null);
    });
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installation accepted');
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }

    setDeferredPrompt(null);
    setStatus(prev => ({ ...prev, canInstall: false }));
  };

  const updateApp = async () => {
    if (!updateSW) return;
    await updateSW();
    setStatus(prev => ({ ...prev, needsUpdate: false }));
  };

  return {
    ...status,
    installApp,
    updateApp
  };
};