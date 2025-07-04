import React, { useState, useEffect } from 'react';
import CourseCard from '../components/learning/CourseCard';
import { motion } from 'framer-motion';
import { Course } from '../types';
import * as courseService from '../services/courseService';

const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  
  useEffect(() => {
    loadCourses();
  }, [selectedCategory, selectedDifficulty]);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filters: {
        category?: string;
        difficulty?: string;
        search?: string;
      } = {};

      if (selectedCategory) filters.category = selectedCategory;
      if (selectedDifficulty) filters.difficulty = selectedDifficulty;
      if (searchTerm.trim()) filters.search = searchTerm;

      const loadedCourses = await courseService.getCourses(filters);
      setCourses(loadedCourses);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error loading courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique categories from loaded courses
  const categories = Array.from(new Set(courses.map(course => course.category)));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCourses();
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Courses</h1>
        
        {/* Search and Filters */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === null
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty(null)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedDifficulty === null
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedDifficulty === difficulty
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
