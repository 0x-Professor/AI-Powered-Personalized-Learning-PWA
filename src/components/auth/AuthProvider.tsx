import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import useUserStore from '../../store/userStore';
import { getUserFromFirestore } from '../../services/authService';
import { sendLearningReminder } from '../../services/notificationService';
import { cacheEssentialContent, cleanupCache } from '../../utils/cacheUtils';
import { useNetwork } from '../../hooks/useNetwork';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setUser } = useUserStore();
  const { isOnline } = useNetwork();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await getUserFromFirestore(firebaseUser.uid);
          if (userData) {
            setUser(userData);
            
            // Schedule daily learning reminder
            if (userData.preferences.dailyGoal) {
              sendLearningReminder(userData.id, userData.preferences.dailyGoal);
            }

            // Cache essential content for offline use if online
            if (isOnline) {
              cacheEssentialContent(userData).catch(error => {
                console.error('Error caching essential content:', error);
              });
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser(null);
      } finally {
        setIsInitialized(true);
      }
    });

    // Set up periodic cache cleanup (every week)
    const cleanupInterval = setInterval(() => {
      cleanupCache().catch(error => {
        console.error('Error cleaning up cache:', error);
      });
    }, 7 * 24 * 60 * 60 * 1000); // 7 days

    return () => {
      unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, [setUser, isOnline]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};