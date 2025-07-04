import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateLearningContent = async (topic: string, context: string): Promise<string> => {
  try {
    const prompt = `Create a detailed lesson about ${topic}. 
    Context: ${context}
    Include:
    - Clear explanations
    - Examples
    - Key takeaways
    - Practice exercises
    Format the content in markdown.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating learning content:', error);
    throw error;
  }
};

export const generateQuiz = async (topic: string, difficulty: string): Promise<string> => {
  try {
    const prompt = `Create a quiz about ${topic} at ${difficulty} level.
    Return a JSON string with this structure:
    {
      "questions": [
        {
          "id": "string",
          "text": "question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctOptionIndex": number,
          "explanation": "why this answer is correct"
        }
      ]
    }
    Include 5 questions that test understanding of key concepts.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

export const getPersonalizedRecommendations = async (
  completedLessons: string[],
  interests: string[],
  learningGoals: string
): Promise<string> => {
  try {
    const prompt = `Create personalized learning recommendations based on:
    Completed lessons: ${completedLessons.join(', ')}
    Interests: ${interests.join(', ')}
    Learning goals: ${learningGoals}
    
    Return a JSON string with this structure:
    {
      "recommendations": [
        {
          "topic": "string",
          "reason": "why this is recommended",
          "difficulty": "beginner|intermediate|advanced"
        }
      ]
    }
    Provide 3 recommendations that build upon completed lessons and align with interests.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
};

export const answerUserQuestion = async (
  question: string,
  currentTopic?: string
): Promise<string> => {
  try {
    const prompt = `Answer this learning-related question: "${question}"
    ${currentTopic ? `Context: The current topic is ${currentTopic}` : ''}
    
    Provide a clear, concise explanation with examples if relevant.
    If applicable, suggest additional resources or next steps for learning.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error answering question:', error);
    throw error;
  }
};
