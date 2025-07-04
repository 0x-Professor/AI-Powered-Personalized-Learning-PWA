import React from 'react';
import { useNetwork } from '../../hooks/useNetwork';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineNotification: React.FC = () => {
  const { isOnline, wasOffline } = useNetwork();

  return (
    <AnimatePresence>
      {(!isOnline || (isOnline && wasOffline)) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`px-6 py-3 rounded-lg shadow-lg ${
            isOnline 
              ? 'bg-green-600 text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            <div className="flex items-center gap-3">
              {isOnline ? (
                <>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  <span>Back online! Syncing your progress...</span>
                </>
              ) : (
                <>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <span>You're offline. Don't worry, your progress will be saved!</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};