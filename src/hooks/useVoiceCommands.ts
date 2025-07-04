import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoicePreferences } from './useVoicePreferences';
import { VoiceCommandProcessor } from '../services/voiceCommandProcessor';
import { sendNotification } from '../services/notificationService';

export const useVoiceCommands = () => {
  const navigate = useNavigate();
  const { preferences, setPreferences, speak, startListening, stopListening, cancelSpeech } = useVoicePreferences();
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const commandProcessor = useRef<VoiceCommandProcessor>();

  useEffect(() => {
    // Initialize the command processor
    commandProcessor.current = new VoiceCommandProcessor(
      navigate,
      (updates) => setPreferences(prev => ({ ...prev, ...updates })),
      speak,
      cancelSpeech
    );
  }, [navigate, setPreferences, speak, cancelSpeech]);

  useEffect(() => {
    if (!preferences.voicePreferences.enabled || !preferences.voicePreferences.voiceEnabled) {
      stopListening();
      return;
    }

    const handleSpeech = (text: string, isFinal: boolean) => {
      if (!isFinal || isProcessingCommand) return;

      setIsProcessingCommand(true);
      const wasProcessed = commandProcessor.current?.processCommand(text);
      
      if (!wasProcessed) {
        sendNotification("Sorry, I didn't understand that command", { speak: true });
      }
      
      setIsProcessingCommand(false);
    };

    startListening(handleSpeech).catch(error => {
      console.error('Failed to start voice recognition:', error);
      sendNotification('Failed to start voice recognition', { type: 'error' });
      setPreferences(prev => ({
        ...prev,
        voicePreferences: {
          ...prev.voicePreferences,
          voiceEnabled: false
        }
      }));
    });

    return () => {
      stopListening();
    };
  }, [
    preferences.voicePreferences.enabled,
    preferences.voicePreferences.voiceEnabled,
    isProcessingCommand,
    startListening,
    stopListening,
    setPreferences
  ]);

  return {
    isProcessingCommand,
    availableCommands: commandProcessor.current?.getAvailableCommands() || []
  };
};