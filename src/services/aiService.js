import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const QUOTES_API_URL = 'https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom';

const aiService = {
    // Generate topic summary
    generateSummary: async (topic) => {
        try {
            const response = await axios.post(
                OPENAI_API_URL,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: `Please provide a concise summary of ${topic} suitable for study preparation.`,
                        },
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );
            
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error generating summary:', error);
            return 'Failed to generate summary. Please try again.';
        }
    },
    
    // Generate practice questions
    generateQuestions: async (topic, numberOfQuestions = 5) => {
        try {
            const response = await axios.post(
                OPENAI_API_URL,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: `Generate ${numberOfQuestions} practice questions for studying ${topic}. Format as a numbered list.`,
                        },
                    ],
                    max_tokens: 500,
                    temperature: 0.8,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );
            
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error generating questions:', error);
            return 'Failed to generate questions. Please try again.';
        }
    },
    
    // Generate flashcard
    generateFlashcards: async (topic, numberOfFlashcards = 5) => {
        try {
            const response = await axios.post(
                OPENAI_API_URL,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: `Create ${numberOfFlashcards} flashcards for ${topic}. Format as: Q: [question] A: [answer]. One per line.`,
                        },
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );
            
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error generating flashcards:', error);
            return 'Failed to generate flashcards. Please try again.';
        }
    },
    
    // Generate study plan
    generateStudyPlan: async (subject) => {
        try {
            const response = await axios.post(
                OPENAI_API_URL,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: `Create a structured study plan for ${subject}. Include topics, time allocation, and milestones.`,
                        },
                    ],
                    max_tokens: 600,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );
            
            return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating study plan:', error);
      return 'Failed to generate study plan. Please try again.';
    }
  },

  // Get motivational quote
  getMotivationalQuote: async () => {
    try {
      const response = await axios.get(QUOTES_API_URL,{
        headers:{
            'X-Api-Key': import.meta.env.VITE_API_NINJAS_KEY,
        }
      });
      return {
        quote: response.data[0].quote,
        author: response.data[0].author,
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      return {
        quote: 'Success is the sum of small efforts repeated day in and day out.',
        author: 'Robert Collier',
      };
    }
  },
};

export default aiService;
