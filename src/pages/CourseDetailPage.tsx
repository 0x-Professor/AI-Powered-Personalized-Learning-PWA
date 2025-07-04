import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import LessonContent from '../components/learning/LessonContent';
import QuizComponent from '../components/learning/QuizComponent';
import useUserStore from '../store/userStore';
import * as courseService from '../services/courseService';
import { Course } from '../types';
import { Card } from '../components/ui/Card';

const CourseDetailPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, addCompletedLesson, addPoints, addBadge } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    if (course && lessonId) {
      const lesson = course.lessons.find(l => l.id === lessonId);
      setActiveLesson(lesson || course.lessons[0]);
    } else if (course && course.lessons.length > 0) {
      setActiveLesson(course.lessons[0]);
    }
  }, [course, lessonId]);

  const loadCourse = async () => {
    if (!courseId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const loadedCourse = await courseService.getCourseById(courseId);
      if (!loadedCourse) {
        setError('Course not found');
        return;
      }
      setCourse(loadedCourse);
    } catch (err) {
      setError('Failed to load course. Please try again later.');
      console.error('Error loading course:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!course || !user) return 0;
    const totalLessons = course.lessons.length;
    if (totalLessons === 0) return 0;
    
    const completedLessons = course.lessons.filter(lesson => 
      user.progress.completedLessons.includes(lesson.id)
    ).length;
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const handleLessonComplete = async () => {
    if (!activeLesson || !user) return;
    
    try {
      await addCompletedLesson(activeLesson.id);
      await addPoints(10); // Award points for completing lesson

      const progress = calculateProgress();
      if (progress === 100) {
        await addBadge(
          `${course?.title} Master`,
          `Completed the ${course?.title} course`
        );
      }

      setShowQuiz(true);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleQuizComplete = async (score: number) => {
    try {
      const points = Math.round(score / 10) * 5; // Award points based on quiz score
      await addPoints(points);

      if (score >= 80) {
        await addBadge(
          `${activeLesson.title} Expert`,
          `Achieved excellence in ${activeLesson.title}`
        );
      }

      // Move to next lesson if available
      if (course) {
        const currentIndex = course.lessons.findIndex(l => l.id === activeLesson.id);
        const nextLesson = course.lessons[currentIndex + 1];
        
        if (nextLesson) {
          navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
          setShowQuiz(false);
        }
      }
    } catch (error) {
      console.error('Error handling quiz completion:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error || 'Course not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {showQuiz ? (
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
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
                {user && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>Progress:</span>
                      <span className="font-medium">{calculateProgress()}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${calculateProgress()}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Course Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lesson List */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <div className="p-4">
                  <h2 className="font-semibold text-gray-900 mb-4">Course Content</h2>
                  <div className="space-y-2">
                    {course.lessons.map((lesson, index) => {
                      const isCompleted = user?.progress.completedLessons.includes(lesson.id);
                      const isActive = lesson.id === activeLesson?.id;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            navigate(`/courses/${courseId}/lessons/${lesson.id}`);
                            setShowQuiz(false);
                          }}
                          className={`w-full p-3 rounded-lg text-left flex items-center gap-3 transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-800'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {isCompleted ? '✓' : index + 1}
                          </span>
                          <span className={`flex-grow ${
                            isCompleted ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>

            {/* Lesson Content */}
            <div className="lg:col-span-3">
              {activeLesson && (
                <LessonContent 
                  lesson={activeLesson}
                  onComplete={handleLessonComplete}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
