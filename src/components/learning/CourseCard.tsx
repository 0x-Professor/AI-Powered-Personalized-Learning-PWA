import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../types';
import { Card, CardContent } from '../ui/Card';

interface CourseCardProps {
  course: Course;
  progress?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, progress }) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <Link to={`/courses/${course.id}`}>
      <Card hover className="h-full transition-all duration-200 hover:translate-y-[-4px]">
        <div className="relative overflow-hidden rounded-t-xl aspect-video">
          <img
            src={course.imageUrl || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070'}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${progress}%` }}
                aria-label={`${progress}% complete`}
              />
            </div>
          )}
        </div>
        <CardContent>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {course.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[course.difficulty]}`}>
              {course.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {course.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.estimatedDuration} min
            </div>
            <div className="flex flex-wrap gap-1">
              {course.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {tag}
                </span>
              ))}
              {course.tags.length > 2 && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  +{course.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
