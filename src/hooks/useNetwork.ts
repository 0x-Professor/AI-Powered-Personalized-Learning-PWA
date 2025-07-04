import { useState, useEffect } from 'react';
import { SyncService } from '../services/syncService';

const syncService = new SyncService();

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        syncData();
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  const syncData = async () => {
    try {
      await syncService.processSyncQueue();
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  return {
    isOnline,
    wasOffline
  };
};