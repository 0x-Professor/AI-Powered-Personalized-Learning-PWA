import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { VoiceCommandGuide } from './VoiceCommandGuide';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import useUserStore from '../../store/userStore';
import { sendNotification } from '../../services/notificationService';

export const AccessibilitySettings: React.FC<{
  onClose?: () => void;
  className?: string;
}> = ({ onClose, className = '' }) => {
  const { user } = useUserStore();
  const { preferences, updatePreferences, isVoiceSupported, availableVoices } = useUserPreferences(user);
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);

  const handlePreferenceChange = (updates: any) => {
    updatePreferences(updates);
    // Provide audio feedback for preference changes if speech is enabled
    if (preferences.voicePreferences.speechEnabled && updates.voicePreferences?.speechEnabled !== false) {
      sendNotification('Settings updated', { speak: true, type: 'success' });
    }
  };

  return (
    <Card className={`p-6 space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Accessibility Settings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">Theme</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'system'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handlePreferenceChange({ theme })}
                className={`px-4 py-2 text-sm rounded-md ${
                  preferences.theme === theme
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">Font Size</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => handlePreferenceChange({ fontSize: size })}
                className={`px-4 py-2 text-sm rounded-md ${
                  preferences.fontSize === size
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Motion and Contrast Settings */}
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={(e) =>
                handlePreferenceChange({ reducedMotion: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-900">Reduce motion</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.highContrast}
              onChange={(e) =>
                handlePreferenceChange({ highContrast: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-900">High contrast</span>
          </label>
        </div>

        {/* Voice Settings */}
        {isVoiceSupported && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Voice Features</h3>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences.voicePreferences.enabled}
                onChange={(e) =>
                  handlePreferenceChange({
                    voicePreferences: {
                      ...preferences.voicePreferences,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-900">Enable voice features</span>
            </label>

            {preferences.voicePreferences.enabled && (
              <>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.voicePreferences.voiceEnabled}
                    onChange={(e) =>
                      handlePreferenceChange({
                        voicePreferences: {
                          ...preferences.voicePreferences,
                          voiceEnabled: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">Voice input</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.voicePreferences.speechEnabled}
                    onChange={(e) =>
                      handlePreferenceChange({
                        voicePreferences: {
                          ...preferences.voicePreferences,
                          speechEnabled: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">Text-to-speech output</span>
                </label>

                {preferences.voicePreferences.speechEnabled && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Voice
                      </label>
                      <select
                        value={preferences.voicePreferences.selectedVoice}
                        onChange={(e) =>
                          handlePreferenceChange({
                            voicePreferences: {
                              ...preferences.voicePreferences,
                              selectedVoice: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {availableVoices.map((voice, index) => (
                          <option key={index} value={index}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Speech Rate: {preferences.voicePreferences.rate}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={preferences.voicePreferences.rate}
                        onChange={(e) =>
                          handlePreferenceChange({
                            voicePreferences: {
                              ...preferences.voicePreferences,
                              rate: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Pitch: {preferences.voicePreferences.pitch}
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={preferences.voicePreferences.pitch}
                        onChange={(e) =>
                          handlePreferenceChange({
                            voicePreferences: {
                              ...preferences.voicePreferences,
                              pitch: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Volume: {Math.round(preferences.voicePreferences.volume * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={preferences.voicePreferences.volume}
                        onChange={(e) =>
                          handlePreferenceChange({
                            voicePreferences: {
                              ...preferences.voicePreferences,
                              volume: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                {/* Voice Command Guide Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowVoiceGuide(true)}
                  className="mt-4"
                >
                  View Voice Commands Guide
                </Button>
              </>
            )}
          </div>
        )}

        {/* Daily Goal Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">Daily Learning Goal</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="5"
              max="240"
              value={preferences.dailyGoal}
              onChange={(e) =>
                handlePreferenceChange({ dailyGoal: Number(e.target.value) })
              }
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">minutes per day</span>
          </div>
        </div>

        {/* Reminder Time Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">Daily Reminder Time</h3>
          <input
            type="time"
            value={preferences.reminderTime}
            onChange={(e) =>
              handlePreferenceChange({ reminderTime: e.target.value })
            }
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Voice Command Guide Modal */}
      {showVoiceGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <VoiceCommandGuide
              onClose={() => setShowVoiceGuide(false)}
              className="relative z-10"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </Card>
  );
};