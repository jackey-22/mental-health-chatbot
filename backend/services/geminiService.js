const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  throw new Error('GEMINI_API_KEY is required. Please set it in your .env file');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a mental health support chatbot designed to provide empathetic, non-judgmental emotional support.

Your role:
- Be empathetic, calm, and supportive
- Listen actively and validate the user's feelings
- Offer healthy coping strategies when appropriate
- Encourage self-care and reaching out to trusted people

IMPORTANT LIMITATIONS:
- You are NOT a medical professional
- Do NOT provide medical diagnoses
- Do NOT prescribe medication
- Do NOT encourage harmful actions
- Do NOT replace professional mental health care

If a user expresses severe distress, encourage them to:
- Reach out to trusted friends or family
- Contact a mental health professional
- Use crisis helplines if needed

Always respond with compassion and understanding. Keep responses concise but warm.`;

const getChatResponse = async (userMessage) => {
  // Try different model names in order of preference
  // Available models as of Dec 2025: gemini-2.5-flash, gemini-2.5-pro, gemini-flash-latest, gemini-pro-latest
  const modelNames = [
    'gemini-2.5-flash',      // Fast and stable (recommended)
    'gemini-flash-latest',   // Always the latest flash model
    'gemini-2.5-pro',        // More capable
    'gemini-pro-latest'      // Fallback to latest pro
  ];

  // Combine system prompt with user message
  const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`;

  let lastError;

  // Try each model until one works
  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      console.log(`Attempting to use model: ${modelName}`);

      // Generate response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      console.log(`Successfully used model: ${modelName}`);
      return text.trim();
    } catch (error) {
      lastError = error;
      console.log(`Model ${modelName} failed, trying next model...`);
      // Continue to next model
      continue;
    }
  }

  // If all models failed, log detailed error and throw
  console.error('All Gemini models failed. Last error details:', {
    message: lastError?.message,
    status: lastError?.status,
    statusText: lastError?.statusText,
    stack: lastError?.stack
  });

  // Provide more specific error message
  if (lastError?.message?.includes('API key') || lastError?.message?.includes('401')) {
    throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env file');
  } else if (lastError?.message?.includes('quota') || lastError?.message?.includes('rate limit') || lastError?.status === 429) {
    throw new Error('Gemini API quota exceeded or rate limited. Please try again later.');
  } else if (lastError?.status === 404) {
    throw new Error('Gemini model not found. Please check if the model name is correct.');
  } else {
    throw new Error(`Failed to get response from AI service: ${lastError?.message || 'Unknown error'}`);
  }
};

module.exports = { getChatResponse };

