import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { SpeechService } from '../services/speechService';

interface VoicePreferences {
  enabled: boolean;
  voiceEnabled: boolean;
  speechEnabled: boolean;
  selectedVoice: number;
  rate: number;
  pitch: number;
  volume: number;
  language: string;
}

const defaultPreferences: VoicePreferences = {
  enabled: false,
  voiceEnabled: false,
  speechEnabled: false,
  selectedVoice: 0,
  rate: 1,
  pitch: 1,
  volume: 1,
  language: 'en-US'
};

export const useVoicePreferences = () => {
  const [speechService] = useState(() => new SpeechService());
  const [preferences, setPreferences] = useLocalStorage<VoicePreferences>(
    'voice-preferences',
    defaultPreferences
  );
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Initialize available voices
  useEffect(() => {
    const updateVoices = () => {
      const voices = speechService.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();

    // Some browsers load voices asynchronously
    if (window.speechSynthesis?.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (window.speechSynthesis?.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [speechService]);

  const speak = useCallback(
    (text: string) => {
      if (!preferences.speechEnabled) return;

      return speechService.speak(text, {
        rate: preferences.rate,
        pitch: preferences.pitch,
        volume: preferences.volume,
        voice: preferences.selectedVoice,
        language: preferences.language
      });
    },
    [preferences, speechService]
  );

  const startListening = useCallback(
    (callback: (text: string, isFinal: boolean) => void) => {
      if (!preferences.voiceEnabled) return;
      return speechService.startListening(callback);
    },
    [preferences.voiceEnabled, speechService]
  );

  const stopListening = useCallback(() => {
    speechService.stopListening();
  }, [speechService]);

  const cancelSpeech = useCallback(() => {
    speechService.cancel();
  }, [speechService]);

  return {
    preferences,
    setPreferences,
    availableVoices,
    isSupported: speechService.isSpeechSupported(),
    isListening: speechService.isListening(),
    isSpeaking: speechService.isSpeaking(),
    speak,
    startListening,
    stopListening,
    cancelSpeech
  };
};