import { GoogleGenerativeAI } from "@google/generative-ai";

// Note: In a production environment, you would want to secure your API key
// This is just for demonstration purposes
const API_KEY = "AIzaSyAnGqvQTwErwyCtA0-0BRJcDrt3zo9DKIg";
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateLearningContent = async (
  topic: string,
  difficulty: string,
  learningStyle: string,
  userContext: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Generate personalized learning content about "${topic}" for a ${difficulty} level student.
      Their preferred learning style is ${learningStyle}.
      Additional context about the student: ${userContext}
      
      Format the content in markdown with:
      - Clear section headings
      - Concise explanations
      - Relevant examples
      - A small practice exercise
      - 2-3 key takeaways
      
      Keep the content engaging, accurate, and tailored to their learning style.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Sorry, I couldn't generate content at this time. Please try again later.";
  }
};

export const generateQuiz = async (
  topic: string,
  difficulty: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Generate a quiz about "${topic}" for a ${difficulty} level student.
      Create 5 multiple-choice questions with 4 options each.
      
      Format the response as JSON with this structure:
      {
        "questions": [
          {
            "text": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctOptionIndex": 0,
            "explanation": "Why this answer is correct"
          }
        ]
      }
      
      Ensure the questions test different aspects of the topic and are appropriate for the ${difficulty} level.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating quiz with Gemini:", error);
    return JSON.stringify({
      questions: [
        {
          text: "Sorry, I couldn't generate a quiz at this time. Please try again later.",
          options: ["Retry", "Contact support", "Try a different topic", "Come back later"],
          correctOptionIndex: 0,
          explanation: "Technical issues can sometimes occur with AI services."
        }
      ]
    });
  }
};

export const getPersonalizedRecommendations = async (
  completedTopics: string[],
  interests: string[],
  learningGoals: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Generate personalized learning recommendations for a student.
      
      They have completed these topics: ${completedTopics.join(", ")}
      Their interests include: ${interests.join(", ")}
      Their learning goals are: ${learningGoals}
      
      Suggest 3-5 new topics they should explore next, explaining why each recommendation would benefit them.
      Format the response as JSON with this structure:
      {
        "recommendations": [
          {
            "topic": "Topic name",
            "reason": "Why this topic is recommended",
            "difficulty": "beginner|intermediate|advanced"
          }
        ]
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating recommendations with Gemini:", error);
    return JSON.stringify({
      recommendations: [
        {
          topic: "Error retrieving recommendations",
          reason: "Please try again later or contact support if the issue persists.",
          difficulty: "beginner"
        }
      ]
    });
  }
};

export const answerUserQuestion = async (
  question: string,
  topicContext: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Answer this question about ${topicContext}:
      "${question}"
      
      Provide a clear, concise, and accurate answer. Include examples if helpful.
      If the question is unclear or requires clarification, explain what additional information would be needed.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error answering question with Gemini:", error);
    return "I'm sorry, I couldn't process your question at this time. Please try again later.";
  }
};
