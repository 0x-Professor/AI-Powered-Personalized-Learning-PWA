import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import { Button } from './Button';

interface VoiceCommandGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCommandGuide: React.FC<VoiceCommandGuideProps> = ({ isOpen, onClose }) => {
  const { availableCommands } = useVoiceCommands();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const handleShowGuide = () => {
      onClose();
    };

    document.addEventListener('showVoiceGuide', handleShowGuide);
    return () => document.removeEventListener('showVoiceGuide', handleShowGuide);
  }, [onClose]);

  const commandExamples = [
    {
      category: 'Navigation',
      examples: [
        'Go to courses',
        'Show my learning',
        'Open assistant',
        'Take me home'
      ]
    },
    {
      category: 'Content Control',
      examples: [
        'Read this',
        'Stop reading',
        'Speak faster',
        'Speak slower'
      ]
    },
    {
      category: 'Learning',
      examples: [
        'Start quiz',
        'Next question',
        'Submit answer',
        'Previous lesson'
      ]
    },
    {
      category: 'Help',
      examples: [
        'What can I say?',
        'Show commands',
        'Help me'
      ]
    }
  ];

  const displayedCommands = showAll ? commandExamples : commandExamples.slice(0, 2);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-lg">
          <Dialog.Title className="text-2xl font-bold mb-4">
            Voice Commands Guide
          </Dialog.Title>

          <div className="space-y-6">
            {displayedCommands.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{section.category}</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {section.examples.map((example, i) => (
                    <li key={i} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                      "{example}"
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="secondary"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Tip: Say "What can I say?" anytime to see this guide again.
          </p>
        </div>
      </div>
    </Dialog>
  );
};