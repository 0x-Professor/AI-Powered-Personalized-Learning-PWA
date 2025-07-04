import React, { useState, useEffect } from 'react';
import { Lesson } from '../../types';
import Button from '../ui/Button';
import useUserStore from '../../store/userStore';
import { generateLearningContent } from '../../utils/geminiApi';
import { motion } from 'framer-motion';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, onComplete }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { user, addCompletedLesson, addPoints } = useUserStore();

  useEffect(() => {
    if (user && user.progress.completedLessons.includes(lesson.id)) {
      setIsCompleted(true);
    }

    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // If lesson has predefined content, use it, otherwise generate with AI
        if (lesson.content) {
          setContent(lesson.content);
        } else {
          const preferences = user?.preferences || { 
            learningStyle: 'visual',
            difficulty: 'beginner' 
          };
          
          const generatedContent = await generateLearningContent(
            lesson.title,
            preferences.difficulty,
            preferences.learningStyle,
            `Learning about ${lesson.title} with interests in ${preferences.interests?.join(', ') || 'general topics'}`
          );
          
          setContent(generatedContent);
        }
      } catch (error) {
        console.error('Error fetching lesson content:', error);
        setContent('Error loading content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [lesson, user]);

  const handleComplete = () => {
    if (!isCompleted && user) {
      addCompletedLesson(lesson.id);
      addPoints(50); // Award points for completing a lesson
      setIsCompleted(true);
      onComplete();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading lesson content...</p>
      </div>
    );
  }

  // Parse markdown content - in a real app, you would use a markdown parser
  // This is a simplified version
  const renderContent = () => {
    // Split content by lines and render each differently based on markdown syntax
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-6 mb-4">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-5 mb-3">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2">
            {line.substring(2)}
          </li>
        );
      } else if (line.startsWith('```')) {
        return (
          <pre key={index} className="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto">
            <code>{line.substring(3)}</code>
          </pre>
        );
      } else if (line.trim() === '') {
        return <div key={index} className="h-4"></div>;
      } else {
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-gray-600">{lesson.description}</p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {lesson.estimatedDuration} min read
        </div>
      </div>

      <div className="prose prose-blue max-w-none">
        {renderContent()}
      </div>

      {lesson.resources && lesson.resources.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Additional Resources</h3>
          <ul className="space-y-2">
            {lesson.resources.map((resource) => (
              <li key={resource.id} className="flex items-center">
                <span className="mr-2">
                  {resource.type === 'video' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    </svg>
                  )}
                  {resource.type === 'article' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  )}
                  {resource.type === 'practice' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleComplete}
          variant="primary"
          size="lg"
          disabled={isCompleted}
        >
          {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
        </Button>
      </div>
    </motion.div>
  );
};

export default LessonContent;
