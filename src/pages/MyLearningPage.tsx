import React from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/learning/CourseCard';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import useUserStore from '../store/userStore';
import { mockCourses } from '../data/mockData';
import { motion } from 'framer-motion';

const MyLearningPage: React.FC = () => {
  const { user } = useUserStore();

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Sign in to view your learning progress</h2>
        <p className="text-gray-500 mb-4">Track your courses, progress, and achievements</p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button variant="primary">Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline">Create account</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter courses that the user has started
  const inProgressCourses = mockCourses.filter(course => 
    course.lessons.some(lesson => user.progress.completedLessons.includes(lesson.id))
  );

  const calculateProgress = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return 0;
    
    const totalLessons = course.lessons.length;
    if (totalLessons === 0) return 0;
    
    const completedLessons = course.lessons.filter(lesson => 
      user.progress.completedLessons.includes(lesson.id)
    ).length;
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
        <p className="text-gray-600">Track your progress and continue where you left off</p>
      </div>
      
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200">
          <CardContent className="flex items-center p-4">
            <div className="rounded-full bg-indigo-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-indigo-700">Learning Streak</p>
              <p className="text-2xl font-bold text-indigo-900">{user.progress.streakDays} days</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-emerald-200">
          <CardContent className="flex items-center p-4">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-700">Completed Lessons</p>
              <p className="text-2xl font-bold text-green-900">{user.progress.completedLessons.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-200">
          <CardContent className="flex items-center p-4">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-amber-700">Learning Points</p>
              <p className="text-2xl font-bold text-amber-900">{user.progress.points}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* In Progress Courses */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">In Progress</h2>
        
        {inProgressCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CourseCard 
                  course={course}
                  progress={calculateProgress(course.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No courses in progress</h3>
            <p className="text-gray-500 mb-4">Start learning by enrolling in a course</p>
            <Link to="/courses">
              <Button variant="primary">Explore courses</Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Badges Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Achievements</h2>
        
        {user.progress.badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {user.progress.badges.map((badge) => (
              <Card key={badge.id} className="text-center p-4 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">{badge.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No badges yet</h3>
            <p className="text-gray-500 mb-4">Complete courses and quizzes to earn badges</p>
          </div>
        )}
      </div>
      
      {/* Learning Preferences */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Learning Preferences</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.preferences.interests.map((interest, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Learning Style</h3>
                <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm inline-block">
                  {user.preferences.learningStyle.charAt(0).toUpperCase() + user.preferences.learningStyle.slice(1)}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Preferred Difficulty</h3>
                <div className={`px-2 py-1 rounded-full text-sm inline-block ${
                  user.preferences.difficulty === 'beginner' 
                    ? 'bg-green-100 text-green-800' 
                    : user.preferences.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.preferences.difficulty.charAt(0).toUpperCase() + user.preferences.difficulty.slice(1)}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Daily Goal</h3>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{user.preferences.dailyGoal} minutes per day</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="outline">
                Update Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyLearningPage;
