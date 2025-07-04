import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { SpeechService } from '../../services/speechService';
import { answerUserQuestion } from '../../utils/geminiApi';
import useUserStore from '../../store/userStore';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI learning assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [currentTopic, setCurrentTopic] = useState<string>('programming');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechService = useRef<SpeechService>(new SpeechService());
  const { user } = useUserStore();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSetTopic = (topic: string) => {
    setCurrentTopic(topic);
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: `I've set the context to ${topic}. How can I help you with this topic?`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await answerUserQuestion(inputText, currentTopic);
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If voice is enabled, speak the response
      if (isSpeaking) {
        speechService.current.speak(response);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      speechService.current.stopListening();
      setIsListening(false);
    } else {
      if (speechService.current.isSupported()) {
        setIsListening(true);
        speechService.current.startListening((text, isFinal) => {
          setInputText(text);
          if (isFinal) {
            handleSubmit();
          }
        });
      } else {
        alert('Speech recognition is not supported in your browser.');
      }
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      speechService.current.cancel();
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <h2 className="text-lg font-medium text-blue-900 mb-1">AI Learning Assistant</h2>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={toggleVoice}
              className={`flex items-center px-3 py-1 rounded-full text-sm ${
                isListening
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              {isListening ? 'Stop' : 'Voice'}
            </button>
            <button
              onClick={toggleSpeaking}
              className={`flex items-center px-3 py-1 rounded-full text-sm ${
                isSpeaking
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828" />
              </svg>
              {isSpeaking ? 'Mute' : 'Speak'}
            </button>
          </div>
          <span className="text-sm text-blue-600">Powered by Gemini</span>
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 flex items-center">Topic:</span>
          {['programming', 'mathematics', 'languages', 'science', 'history'].map((topic) => (
            <button
              key={topic}
              onClick={() => handleSetTopic(topic)}
              className={`px-3 py-1 text-sm rounded-full ${
                currentTopic === topic
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.isUser
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="whitespace-pre-wrap">{message.text}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything about learning..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing || isListening}
          />
          <button
            type="submit"
            disabled={isProcessing || !inputText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AIAssistant;
