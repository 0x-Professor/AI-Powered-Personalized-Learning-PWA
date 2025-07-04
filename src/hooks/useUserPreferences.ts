import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useVoicePreferences } from './useVoicePreferences';
import { User } from '../types';
import { updateUserPreferences } from '../services/authService';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  dailyGoal: number;
  reminderTime: string;
  voicePreferences: {
    enabled: boolean;
    voiceEnabled: boolean;
    speechEnabled: boolean;
    selectedVoice: number;
    rate: number;
    pitch: number;
    volume: number;
    language: string;
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  dailyGoal: 30,
  reminderTime: '09:00',
  voicePreferences: {
    enabled: false,
    voiceEnabled: false,
    speechEnabled: false,
    selectedVoice: 0,
    rate: 1,
    pitch: 1,
    volume: 1,
    language: 'en-US'
  }
};

export const useUserPreferences = (user: User | null) => {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'user-preferences',
    defaultPreferences
  );
  const voicePrefs = useVoicePreferences();

  // Sync voice preferences with the main preferences
  useEffect(() => {
    if (preferences.voicePreferences !== voicePrefs.preferences) {
      setPreferences(prev => ({
        ...prev,
        voicePreferences: voicePrefs.preferences
      }));
    }
  }, [voicePrefs.preferences]);

  // Sync preferences with the server when they change
  useEffect(() => {
    if (user) {
      updateUserPreferences(user.id, preferences).catch(error => {
        console.error('Error updating user preferences:', error);
      });
    }
  }, [user, preferences]);

  // Apply theme preference
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      if (preferences.theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
      } else {
        root.classList.toggle('dark', preferences.theme === 'dark');
      }
    };

    applyTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme();
    mediaQuery.addListener(handler);

    return () => mediaQuery.removeListener(handler);
  }, [preferences.theme]);

  // Apply font size preference
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[preferences.fontSize];
  }, [preferences.fontSize]);

  // Apply reduced motion preference
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      '--reduce-motion',
      preferences.reducedMotion ? 'reduce' : 'no-preference'
    );
  }, [preferences.reducedMotion]);

  // Apply high contrast preference
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', preferences.highContrast);
  }, [preferences.highContrast]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  };

  return {
    preferences,
    updatePreferences,
    isVoiceSupported: voicePrefs.isSupported,
    availableVoices: voicePrefs.availableVoices
  };
};