import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

const AiAssistantPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Learning Assistant</h1>
        <p className="text-gray-600">Get personalized help with your learning journey</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-grow p-0 flex flex-col">
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                <h2 className="text-lg font-medium text-blue-900">Learning Assistant</h2>
                <p className="text-sm text-blue-700">Powered by Google Gemini AI</p>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {/* Assistant welcome message */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      AI
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-gray-800">
                      Hello! I'm your learning assistant powered by Google Gemini. I can help you with:
                    </p>
                    <ul className="list-disc ml-5 mt-2 text-gray-700 text-sm">
                      <li>Explaining complex concepts</li>
                      <li>Creating personalized study plans</li>
                      <li>Answering questions about your courses</li>
                      <li>Providing additional learning resources</li>
                    </ul>
                    <p className="mt-2 text-gray-800">How can I help you today?</p>
                  </div>
                </div>
                
                {/* Example user message */}
                <div className="flex items-start justify-end">
                  <div className="bg-blue-500 p-3 rounded-lg rounded-tr-none max-w-[80%]">
                    <p className="text-white">
                      Can you explain the concept of machine learning in simple terms?
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      U
                    </div>
                  </div>
                </div>
                
                {/* Assistant response */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      AI
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-gray-800">
                      Absolutely! Machine learning is like teaching a computer to learn from experience, similar to how humans learn.
                    </p>
                    <p className="mt-2 text-gray-800">
                      Imagine teaching a child to recognize fruits. You show them apples, oranges, and bananas repeatedly until they can identify each fruit on their own. Machine learning works the same way:
                    </p>
                    <ol className="list-decimal ml-5 mt-2 text-gray-700">
                      <li>We feed the computer lots of examples (data)</li>
                      <li>The computer finds patterns in that data</li>
                      <li>It builds a model based on those patterns</li>
                      <li>Then it can make predictions or decisions on new data it hasn't seen before</li>
                    </ol>
                    <p className="mt-2 text-gray-800">
                      Instead of being explicitly programmed with rules, the computer learns the rules from the data itself!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask me anything about your learning journey..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <button className="mr-3 flex items-center hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Attach
                  </button>
                  <button className="flex items-center hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Voice
                  </button>
                  <span className="ml-auto">Powered by Google Gemini</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Suggested Topics</h2>
              <div className="space-y-2">
                <button className="w-full text-left p-2 rounded hover:bg-gray-50 text-gray-700">
                  How to improve my coding skills?
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-gray-50 text-gray-700">
                  Explain the difference between SQL and NoSQL
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-gray-50 text-gray-700">
                  What are the best resources for learning Python?
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-gray-50 text-gray-700">
                  Create a study plan for web development
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-gray-50 text-gray-700">
                  Tips for staying motivated while learning
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Learning Insights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">Your Strengths</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      JavaScript
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      React Fundamentals
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      HTML/CSS
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Areas to Improve</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Data Structures
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Algorithms
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Backend Development
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Recommended Focus</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on your learning patterns, we recommend focusing on Node.js and Express to strengthen your full-stack development skills.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <h2 className="text-lg font-medium text-gray-900 mb-3">How I Can Help</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Generate personalized learning paths based on your goals</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Explain complex topics in simple, easy-to-understand language</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Create practice exercises tailored to your skill level</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Recommend resources like articles, videos, and books</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Help troubleshoot coding problems or conceptual questions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
