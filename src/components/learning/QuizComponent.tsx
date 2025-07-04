import React, { useState, useEffect } from 'react';
import { Quiz, Question } from '../../types';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { generateQuiz } from '../../utils/geminiApi';
import useUserStore from '../../store/userStore';
import { motion } from 'framer-motion';

interface QuizComponentProps {
  quizData?: Quiz;
  topic: string;
  onComplete: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizData, topic, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quiz, setQuiz] = useState<Quiz | null>(quizData || null);
  const [isLoading, setIsLoading] = useState(!quizData);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const { user } = useUserStore();

  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizData) {
        setIsLoading(true);
        try {
          const difficulty = user?.preferences?.difficulty || 'beginner';
          const quizString = await generateQuiz(topic, difficulty);
          
          // Parse the JSON string from the API
          try {
            const parsedQuiz = JSON.parse(quizString);
            setQuiz({
              id: `quiz-${Date.now()}`,
              questions: parsedQuiz.questions,
              passingScore: 70
            });
          } catch (parseError) {
            console.error('Error parsing quiz JSON:', parseError);
            // Fallback to a simple quiz if parsing fails
            setQuiz({
              id: `quiz-${Date.now()}`,
              questions: [
                {
                  id: '1',
                  text: 'Could not generate quiz questions. What would you like to do?',
                  options: ['Try again', 'Skip quiz', 'Contact support', 'Learn more about this topic'],
                  correctOptionIndex: 0,
                  explanation: 'Technical issues can sometimes occur with AI services.'
                }
              ],
              passingScore: 100
            });
          }
        } catch (error) {
          console.error('Error generating quiz:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadQuiz();
  }, [quizData, topic, user]);

  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswered) {
      setSelectedOption(optionIndex);
      setIsAnswered(true);
      
      const currentQuestion = quiz?.questions[currentQuestionIndex];
      if (currentQuestion && optionIndex === currentQuestion.correctOptionIndex) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz completed
      const finalScore = Math.round((score + (selectedOption === quiz.questions[currentQuestionIndex].correctOptionIndex ? 1 : 0)) / quiz.questions.length * 100);
      setQuizCompleted(true);
      onComplete(finalScore);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Generating quiz questions...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Failed to load quiz. Please try again later.</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="primary"
          className="mt-4"
        >
          Reload
        </Button>
      </div>
    );
  }

  if (quizCompleted) {
    const finalScore = Math.round(score / quiz.questions.length * 100);
    const passed = finalScore >= quiz.passingScore;
    
    return (
      <motion.div 
        className="max-w-2xl mx-auto p-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`p-8 rounded-xl ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
            {passed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          <h2 className={`text-2xl font-bold mt-4 ${passed ? 'text-green-700' : 'text-red-700'}`}>
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          
          <p className="text-gray-600 mt-2">
            You scored {finalScore}% on this quiz.
            {passed 
              ? ' Great job on mastering this topic!' 
              : ` You need ${quiz.passingScore}% to pass. Let's review the material and try again.`
            }
          </p>
          
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry Quiz
            </Button>
            <Button
              variant="primary"
              onClick={() => window.history.back()}
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quiz: {topic}</h2>
        <span className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </span>
      </div>
      
      <div className="mb-4 w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      <Card className="mb-6">
        <CardContent>
          <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selectedOption === index
                      ? isAnswered && index === currentQuestion.correctOptionIndex
                        ? 'bg-green-50 border-green-500'
                        : isAnswered
                        ? 'bg-red-50 border-red-500'
                        : 'bg-blue-50 border-blue-500'
                      : isAnswered && index === currentQuestion.correctOptionIndex
                      ? 'bg-green-50 border-green-500'
                      : 'hover:bg-gray-50 border-gray-300'
                  }`}
                  disabled={isAnswered}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full border mr-3 ${
                      selectedOption === index
                        ? isAnswered && index === currentQuestion.correctOptionIndex
                          ? 'bg-green-500 text-white border-green-500'
                          : isAnswered
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-blue-500 text-white border-blue-500'
                        : isAnswered && index === currentQuestion.correctOptionIndex
                        ? 'bg-green-500 text-white border-green-500'
                        : 'border-gray-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    {option}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
          
          {isAnswered && (
            <div className={`mt-4 p-3 rounded-lg ${
              selectedOption === currentQuestion.correctOptionIndex
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${
                selectedOption === currentQuestion.correctOptionIndex
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}>
                {selectedOption === currentQuestion.correctOptionIndex
                  ? 'Correct!'
                  : 'Incorrect'}
              </p>
              <p className="text-gray-700 mt-1">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleNextQuestion}
          variant="primary"
          disabled={!isAnswered}
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </Button>
      </div>
    </div>
  );
};

export default QuizComponent;
