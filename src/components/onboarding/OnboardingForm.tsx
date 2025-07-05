import React, { useState } from 'react';
import { LearningPreferences } from '../../types';
import { Button } from '../ui/Button';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OnboardingForm: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: [] as string[],
    learningStyle: 'visual' as LearningPreferences['learningStyle'],
    difficulty: 'beginner' as LearningPreferences['difficulty'],
    dailyGoal: 30,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    // Create user in store
    setUser({
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      preferences: {
        interests: formData.interests,
        learningStyle: formData.learningStyle,
        difficulty: formData.difficulty,
        dailyGoal: formData.dailyGoal,
      },
      progress: {
        streakDays: 0,
        lastActive: new Date(),
        completedLessons: [],
        points: 0,
        badges: [],
      },
      joinedAt: new Date(),
    });
    
    // Redirect to dashboard
    navigate('/');
  };

  const interestOptions = [
    'Programming', 'Web Development', 'Data Science', 'Machine Learning',
    'Languages', 'Mathematics', 'Science', 'History', 'Arts', 'Business'
  ];

  return (
    <motion.div 
      className="max-w-md w-full mx-auto p-6 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Let's personalize your learning experience</h2>
        <p className="text-gray-600 mt-2">Step {step} of 3</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What topics are you interested in?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <div
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`
                      p-3 border rounded-md cursor-pointer transition-colors
                      ${
                        formData.interests.includes(interest)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    {interest}
                  </div>
                ))}
              </div>
              {formData.interests.length === 0 && (
                <p className="text-red-500 text-xs mt-1">Please select at least one interest</p>
              )}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-4">
              <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700 mb-1">
                What's your preferred learning style?
              </label>
              <select
                id="learningStyle"
                name="learningStyle"
                value={formData.learningStyle}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="visual">Visual (images, diagrams)</option>
                <option value="auditory">Auditory (discussions, audio)</option>
                <option value="reading">Reading/Writing (text-based)</option>
                <option value="kinesthetic">Hands-on (practical exercises)</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred difficulty level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="dailyGoal" className="block text-sm font-medium text-gray-700 mb-1">
                Daily learning goal (minutes)
              </label>
              <input
                type="number"
                id="dailyGoal"
                name="dailyGoal"
                min="5"
                max="240"
                value={formData.dailyGoal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>
        )}

        <div className="flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={step === 2 && formData.interests.length === 0}
            className="ml-auto"
          >
            {step === 3 ? 'Start Learning' : 'Continue'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default OnboardingForm;
