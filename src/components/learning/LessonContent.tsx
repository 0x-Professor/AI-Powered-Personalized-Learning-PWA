import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Lesson } from '../../types';
import { SpeechService } from '../../services/speechService';
import { useVoicePreferences } from '../../hooks/useVoicePreferences';
import ReactMarkdown from 'react-markdown';

interface Props {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonContent: React.FC<Props> = ({ lesson, onComplete }) => {
  const [isReading, setIsReading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const speechService = useRef(new SpeechService());
  const { preferences } = useVoicePreferences();

  // Split content into sections by headers for better navigation
  const sections = lesson.content
    .split(/(?=#{1,3}\s)/)
    .filter(section => section.trim());

  useEffect(() => {
    if (preferences.speechEnabled && preferences.enabled) {
      speechService.current.speak(
        'Lesson loaded: ' + lesson.title,
        {
          rate: preferences.rate,
          pitch: preferences.pitch,
          voice: preferences.selectedVoice
        }
      );
    }

    return () => {
      speechService.current.cancel();
    };
  }, [lesson, preferences]);

  const handleVoiceCommand = (command: string) => {
    const normalizedCommand = command.toLowerCase().trim();

    if (normalizedCommand.includes('next section') || normalizedCommand.includes('next page')) {
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
        readSection(currentSection + 1);
      }
    } else if (normalizedCommand.includes('previous section') || normalizedCommand.includes('previous page')) {
      if (currentSection > 0) {
        setCurrentSection(prev => prev - 1);
        readSection(currentSection - 1);
      }
    } else if (normalizedCommand.includes('complete') || normalizedCommand.includes('finish')) {
      handleComplete();
    } else if (normalizedCommand.includes('read') || normalizedCommand.includes('start reading')) {
      readSection(currentSection);
    } else if (normalizedCommand.includes('stop') || normalizedCommand.includes('pause')) {
      stopReading();
    }
  };

  const toggleVoiceCommands = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (!speechService.current.isSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(true);
    speechService.current.startListening((text, isFinal) => {
      if (isFinal) {
        handleVoiceCommand(text);
      }
    });
  };

  const stopListening = () => {
    setIsListening(false);
    speechService.current.stopListening();
  };

  const readSection = (sectionIndex: number) => {
    if (!preferences.speechEnabled || !preferences.enabled) return;

    setIsReading(true);
    speechService.current.speak(
      sections[sectionIndex],
      {
        rate: preferences.rate,
        pitch: preferences.pitch,
        voice: preferences.selectedVoice
      }
    );
  };

  const stopReading = () => {
    setIsReading(false);
    speechService.current.cancel();
  };

  const handleComplete = () => {
    if (preferences.speechEnabled && preferences.enabled) {
      speechService.current.speak('Congratulations! You have completed this lesson.');
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
        
        <div className="flex items-center gap-2">
          {preferences.enabled && (
            <button
              onClick={toggleVoiceCommands}
              className={`p-2 rounded-full ${
                isListening
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isListening ? 'Stop voice commands' : 'Enable voice commands'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
          )}

          {preferences.speechEnabled && preferences.enabled && (
            <button
              onClick={() => isReading ? stopReading() : readSection(currentSection)}
              className={`p-2 rounded-full ${
                isReading
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isReading ? 'Stop reading' : 'Read aloud'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="prose max-w-none"
      >
        <ReactMarkdown>{sections[currentSection]}</ReactMarkdown>
      </motion.div>

      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => {
            if (currentSection > 0) {
              setCurrentSection(prev => prev - 1);
              readSection(currentSection - 1);
            }
          }}
          disabled={currentSection === 0}
        >
          Previous Section
        </Button>

        {currentSection === sections.length - 1 ? (
          <Button onClick={handleComplete}>Complete Lesson</Button>
        ) : (
          <Button
            onClick={() => {
              setCurrentSection(prev => prev + 1);
              readSection(currentSection + 1);
            }}
          >
            Next Section
          </Button>
        )}
      </div>
    </div>
  );
};

export default LessonContent;
