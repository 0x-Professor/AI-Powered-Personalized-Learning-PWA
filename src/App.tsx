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

const LoadingScreen = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const tips = [
    'Start by designing your UI before diving into complex backend features.',
    "Use the '+' button to upload and incorporate custom images into your app.",
    'Your app preview will automatically refresh when new changes are ready.',
    'Connect with fellow developers in our Discord to share and learn together.',
    'Need help? Ask questions in the AI chat panel located on the right side.',
    'Show screenshots to the AI to get help with visual issues or inspiration.',
    "Share your creation with others by clicking 'Publish' to deploy your app.",
    'Subscribe to choose custom subdomains and remove watermarks from apps.',
    'Add a knowledge.md file to teach the AI about specific technologies.',
    "Track your progress and review code changes using the 'Review' button.",
    "Advanced users can edit code directly in the 'Code' tab - use with care!",
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
    <div className="fixed inset-0" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="relative size-full">
        <div className="absolute inset-0 bg-[#f9f9f9] flex size-full flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="relative flex items-center justify-center w-10 h-10 bg-white border rounded-full">
            <div className="absolute h-10 w-10 rounded-full animate-spin bg-gradient-to-b from-black/50 to-transparent"></div>
            <div className="absolute flex items-center justify-center bg-white rounded-full h-[38px] w-[38px]">
              <svg
                width={14 * (1920 / 1084)}
                height={14}
                viewBox="0 0 1920 1084"
                fill="black"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_6727_1730)">
                  <path
                    d="M496.36 933.52V714.848C496.36 561.289 291.434 507.242 214.842 640.703L139.842 771.304C118.857 807.887 71.5077 820.157 35.068 798.026C-0.0838509 776.723 -9.85666 729.978 10.5223 694.373L365.525 76.1461C442.117 -57.2398 647.043 -3.26819 647.043 150.367V369.866C647.043 523.35 851.893 577.397 928.56 444.162L1140.46 75.6945C1217.12 -57.6162 1421.97 -3.56926 1421.97 149.99V371.071C1421.97 524.555 1626.67 578.602 1703.42 445.442L1780.23 312.131C1801.29 275.623 1848.64 263.353 1885.01 285.559C1920.16 307.012 1929.86 353.682 1909.4 389.287L1552.73 1008.42C1475.99 1141.58 1271.29 1087.53 1271.29 934.047V713.719C1271.29 560.235 1066.44 506.188 989.773 639.423L777.877 1007.89C701.21 1141.2 496.36 1087.15 496.36 933.595V933.52Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_6727_1730">
                    <rect width="1920" height="1084" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <div className="text-[#000000] font-medium">Hang tight...</div>

          <div className="relative h-[115px] pt-4 pb-8 -mt-4 w-[280px] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-4 z-10 bg-gradient-to-t from-transparent to-[#f9f9f9]" />
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${currentTipIndex * 48 + 4}px)` }}
            >
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className={`h-8 mb-4 flex items-center justify-center text-[#666666] text-sm leading-[1.2] transition-opacity duration-500 ${index === currentTipIndex ? 'opacity-100' : 'opacity-50'}`}
                >
                  {tip}
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-16 z-10 bg-gradient-to-b from-transparent to-[#f9f9f9]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Simulate app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} /> {/* Add index route */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<CourseDetailPage />} />
        <Route path="/my-learning" element={<MyLearningPage />} />
        <Route path="/assistant" element={<AiAssistantPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
