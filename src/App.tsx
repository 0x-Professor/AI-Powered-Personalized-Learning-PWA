import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyLearningPage from './pages/MyLearningPage';
import AiAssistantPage from './pages/AiAssistantPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './components/auth/AuthProvider';
import { usePWA } from './hooks/usePWA';

const LoadingScreen = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const tips = [
    'Get personalized course recommendations based on your learning style',
    'Track your progress and earn badges as you learn',
    'Practice with AI-generated quizzes tailored to your level',
    'Connect with the learning community to share insights',
    'Use voice commands to interact with your AI learning assistant',
    'Access your courses offline with our PWA technology',
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => {
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="relative flex items-center justify-center w-16 h-16 mb-8">
          <div className="absolute w-full h-full rounded-full animate-spin bg-gradient-to-r from-blue-500 to-indigo-600 opacity-25"></div>
          <div className="absolute w-12 h-12 bg-white rounded-full"></div>
          <svg className="relative w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        <div className="text-xl font-semibold text-gray-900 mb-4">
          Loading BrainWave
        </div>

        <div className="relative h-[60px] w-[280px] overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-4 z-10 bg-gradient-to-b from-blue-50 to-transparent"></div>
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${currentTipIndex * 40}px)` }}
          >
            {tips.map((tip, index) => (
              <div
                key={index}
                className="h-10 flex items-center justify-center text-gray-600 text-sm px-4 text-center"
              >
                {tip}
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-4 z-10 bg-gradient-to-t from-blue-50 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { needsUpdate, updateApp, canInstall, installApp } = usePWA();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      {needsUpdate && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
            <p className="mb-2">A new version is available!</p>
            <button
              onClick={updateApp}
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
            >
              Update now
            </button>
          </div>
        </div>
      )}

      {canInstall && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
            <p className="mb-2">Install BrainWave for the best experience</p>
            <button
              onClick={installApp}
              className="bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Install
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<CourseDetailPage />} />
          <Route path="/my-learning" element={<MyLearningPage />} />
          <Route path="/assistant" element={<AiAssistantPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
