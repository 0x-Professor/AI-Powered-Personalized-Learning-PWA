import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { mockCourses } from '../data/mockData';
import { motion } from 'framer-motion';
import LessonContent from '../components/learning/LessonContent';
import QuizComponent from '../components/learning/QuizComponent';
import useUserStore from '../store/userStore';

const CourseDetailPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const [course, setCourse] = useState(mockCourses.find(c => c.id === courseId));
  const [activeLesson, setActiveLesson] = useState(
    course?.lessons.find(l => l.id === lessonId) || course?.lessons[0]
  );
  const [showQuiz, setShowQuiz] = useState(false);
  
  const { user, addCompletedLesson, addPoints, addBadge } = useUserStore();
  
  useEffect(() => {
    setCourse(mockCourses.find(c => c.id === courseId));
  }, [courseId]);
  
  useEffect(() => {
    if (course) {
      setActiveLesson(
        course.lessons.find(l => l.id === lessonId) || course.lessons[0]
      );
    }
  }, [course, lessonId]);
  
  if (!course) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Course Not Found</h2>
        <p className="text-gray-500 mb-4">The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses">
          <Button variant="primary">Back to Courses</Button>
        </Link>
      </div>
    );
  }
  
  const calculateProgress = () => {
    if (!user) return 0;
    
    const totalLessons = course.lessons.length;
    if (totalLessons === 0) return 0;
    
    const completedLessons = course.lessons.filter(lesson => 
      user.progress.completedLessons.includes(lesson.id)
    ).length;
    
    return Math.round((completedLessons / totalLessons) * 100);
  };
  
  const handleLessonComplete = () => {
    if (activeLesson && !showQuiz) {
      if (activeLesson.quiz) {
        setShowQuiz(true);
      } else {
        // If no quiz, check if this completes the course
        checkCourseCompletion();
      }
    }
  };
  
  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    if (score >= 70) {
      addPoints(100); // Award points for passing quiz
      checkCourseCompletion();
    }
  };
  
  const checkCourseCompletion = () => {
    if (!user) return;
    
    const progress = calculateProgress();
    if (progress === 100) {
      // Award badge for completing course
      addBadge(
        `${course.title} Mastery`, 
        `Completed the ${course.title} course successfully.`
      );
      addPoints(500); // Bonus points for course completion
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {!activeLesson || (showQuiz && activeLesson.quiz) ? (
        // Course overview or quiz view
        <div>
          {showQuiz && activeLesson && activeLesson.quiz ? (
            <QuizComponent 
              quizData={activeLesson.quiz} 
              topic={activeLesson.title}
              onComplete={handleQuizComplete}
            />
          ) : (
            <div>
              {/* Course Header */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="w-full h-48 md:h-64 object-cover rounded-xl"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {course.category}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        course.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-800' 
                          : course.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.estimatedDuration} min
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {course.lessons.length} lessons
                      </div>
                    </div>
                    {user && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Your progress</span>
                          <span className="text-sm text-gray-600">{calculateProgress()}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${calculateProgress()}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3">
                      {course.lessons.length > 0 ? (
                        <Link to={`/courses/${course.id}/lessons/${course.lessons[0].id}`}>
                          <Button variant="primary">
                            {user && calculateProgress() > 0 ? 'Continue Course' : 'Start Course'}
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="primary" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Course Content */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                {course.lessons.length > 0 ? (
                  <div className="border rounded-xl overflow-hidden">
                    {course.lessons.map((lesson, index) => {
                      const isCompleted = user?.progress.completedLessons.includes(lesson.id);
                      
                      return (
                        <Link 
                          key={lesson.id} 
                          to={`/courses/${course.id}/lessons/${lesson.id}`}
                          className={`block border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                            isCompleted ? 'bg-green-50' : ''
                          }`}
                        >
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                isCompleted 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {isCompleted ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                                <p className="text-sm text-gray-500">{lesson.estimatedDuration} min</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {lesson.quiz && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                                  Quiz
                                </span>
                              )}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-xl bg-gray-50">
                    <p className="text-gray-500">Course content coming soon!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Lesson view
        <div>
          <div className="mb-4">
            <Link to={`/courses/${course.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to course
            </Link>
          </div>
          
          <LessonContent lesson={activeLesson} onComplete={handleLessonComplete} />
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
