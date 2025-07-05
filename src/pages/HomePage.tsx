import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import CourseCard from '../components/learning/CourseCard';
import useUserStore from '../store/userStore';
import { mockCourses } from '../data/mockData';
import { getPersonalizedRecommendations } from '../utils/geminiApi';
import { motion } from 'framer-motion';

interface Recommendation {
  topic: string;
  reason: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const HomePage: React.FC = () => {
  const { user, incrementStreak } = useUserStore();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if it's a new day to increment streak
    if (user) {
      const lastActive = new Date(user.progress.lastActive);
      const today = new Date();
      if (
        lastActive.getDate() !== today.getDate() ||
        lastActive.getMonth() !== today.getMonth() ||
        lastActive.getFullYear() !== today.getFullYear()
      ) {
        incrementStreak();
      }
    }
    
    // Get AI recommendations if user has interests
    const fetchRecommendations = async () => {
      if (user && user.preferences.interests.length > 0) {
        setIsLoading(true);
        try {
          const completedLessons = user.progress.completedLessons;
          const interests = user.preferences.interests;
          const learningGoals = `Learning ${user.preferences.difficulty} level content with a ${user.preferences.learningStyle} learning style.`;
          
          const recommendationsJson = await getPersonalizedRecommendations(
            completedLessons,
            interests,
            learningGoals
          );
          
          try {
            const parsed = JSON.parse(recommendationsJson);
            setRecommendations(parsed.recommendations);
          } catch (error) {
            console.error('Error parsing recommendations:', error);
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchRecommendations();
  }, [user, incrementStreak]);

  // Filter courses for featured, continue learning, and trending sections
  const featuredCourses = mockCourses.slice(0, 3);
  
  const inProgressCourses = user 
    ? mockCourses.filter(course => 
        course.lessons.some(lesson => user.progress.completedLessons.includes(lesson.id))
      ).slice(0, 3)
    : [];
  
  const calculateProgress = (courseId: string) => {
    if (!user) return 0;
    
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
      {/* Welcome Banner */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg mb-8 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {user ? `Welcome back, ${user.name}!` : 'Start your learning journey today'}
            </h1>
            <p className="text-blue-100 mb-4">
              {user 
                ? `You're on a ${user.progress.streakDays}-day learning streak. Keep it up!` 
                : 'Personalized learning experiences powered by AI'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                {user ? 'Continue Learning' : 'Get Started'}
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                Browse Courses
              </Button>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070" 
              alt="Learning" 
              className="w-full md:w-48 h-32 md:h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards (for logged in users) */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="flex items-center p-4">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-700">Learning Points</p>
                <p className="text-2xl font-bold text-blue-900">{user.progress.points}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="flex items-center p-4">
              <div className="rounded-full bg-amber-100 p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-700">Daily Goal</p>
                <p className="text-2xl font-bold text-amber-900">{user.preferences.dailyGoal} min</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Continue Learning Section (for logged in users with progress) */}
      {user && inProgressCourses.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
            <Link to="/my-learning" className="text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                progress={calculateProgress(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations Section */}
      {user && recommendations.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{rec.topic}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-800' 
                          : rec.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rec.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{rec.reason}</p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Explore Topic
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Courses Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Learning Path Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Learning Paths</h2>
          <Link to="/paths" className="text-blue-600 hover:text-blue-800">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40">
              <img 
                src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070" 
                alt="Web Developer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-xl">Web Developer</h3>
              </div>
            </div>
            <CardContent>
              <p className="text-gray-600 mb-4">Master HTML, CSS, JavaScript, and modern frameworks to become a web developer.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">6 courses • 45+ hours</span>
                <Button variant="outline" size="sm">
                  View Path
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40">
              <img 
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2071" 
                alt="Data Scientist" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-xl">Data Scientist</h3>
              </div>
            </div>
            <CardContent>
              <p className="text-gray-600 mb-4">Learn Python, data analysis, machine learning, and AI to become a data scientist.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">8 courses • 60+ hours</span>
                <Button variant="outline" size="sm">
                  View Path
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Join Community Section */}
      <motion.div 
        className="bg-indigo-50 rounded-xl p-6 md:p-8 mb-8"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Join our learning community</h2>
            <p className="text-indigo-700 mb-4">
              Connect with fellow learners, participate in discussions, and accelerate your learning journey.
            </p>
            <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700">
              Join Community
            </Button>
          </div>
          <div className="mt-6 md:mt-0 md:ml-6">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070" 
              alt="Community" 
              className="w-full md:w-64 h-40 object-cover rounded-lg"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
