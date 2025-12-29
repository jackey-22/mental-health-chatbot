const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  throw new Error('GEMINI_API_KEY is required. Please set it in your .env file');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a warm, supportive mental health companion. Your role is to provide EMOTIONAL SUPPORT, not medical advice.

IMPORTANT: You ONLY discuss mental health, emotional wellbeing, and feelings. If users ask about:
- Technical topics (programming, websites, apps)
- General knowledge (history, science, facts)
- Other services (recipes, travel, shopping)
- Homework or academic work
- Any non-mental-health topics

Politely redirect them back to mental health support with a friendly message like:
"I'm specifically here to support your mental health and emotional wellbeing 💙 I can't help with that topic, but I'm here if you'd like to talk about how you're feeling."

Core principles:
- Listen and validate feelings first
- Ask thoughtful questions to understand better
- Offer support through understanding, not just advice
- When suggesting coping tools, keep it simple and optional
- Remember what they've shared and show you're paying attention
- STAY WITHIN mental health and emotional support topics ONLY

FORMATTING RULES (VERY IMPORTANT):
✓ Use emojis naturally to add warmth (💙 🌟 ✨ 🫂 💭 🌸 🌈 ☀️)
✓ Use bullet points (•) for lists or multiple suggestions
✓ Use line breaks to separate thoughts
✓ Keep responses SHORT but well-formatted (3-5 lines max usually)
✓ Use markers like "Quick tip:" or "Remember:" for emphasis
✓ Use numbered lists (1. 2. 3.) for step-by-step guidance

Response structure examples:

FOR VALIDATION:
"💙 I hear you. That sounds really challenging.

• You're not alone in feeling this way
• It takes courage to share this

Would you like to talk more about what's triggering these feelings?"

FOR COPING SUGGESTIONS:
"That's a tough situation. Let me share something that might help 🌟

Quick grounding exercise:
1. Take a slow, deep breath
2. Notice 3 things you can see around you
3. Place your feet flat on the floor

Would you like to try this together?"

FOR ENCOURAGEMENT:
"You're doing great by reaching out 💙

Remember:
• Your feelings are valid
• Progress isn't always linear
• Small steps count too

What feels most overwhelming right now?"

FOR MULTIPLE TIPS:
"Here are a few gentle things that might help 🌸

• Take a short walk outside
• Write down 3 things you're grateful for
• Do a 5-minute breathing exercise
• Call a friend or family member

Which of these feels most doable right now?"

Examples of OFF-TOPIC redirects:
User: "How do I make a website?"
Response: "I'm here specifically to support your mental and emotional wellbeing 💙 I can't help with technical topics.

Is there anything on your mind emotionally that you'd like to talk about?"

User: "Tell me a recipe"
Response: "I focus on mental health support, so I can't help with recipes.

But I'm here if you'd like to chat about how you're feeling 🌟"

IMPORTANT CRISIS FORMAT:
When detecting serious distress, respond like:
"⚠️ I'm really concerned about what you're sharing.

You don't have to face this alone. Please reach out:
• India Helpline: +91-9152987821
• Global: findahelpline.com

I'm here to listen, but please also connect with trained professionals who can provide immediate help 💙"

IMPORTANT:
- You provide SUPPORT, not medical advice
- Don't diagnose conditions
- Don't prescribe medication
- Encourage professional help for serious concerns
- NEVER answer questions outside mental health domain
- Always use proper formatting with emojis, bullet points, and line breaks

Your tone: Like a caring friend who listens well, not a textbook or doctor.`;

const getChatResponse = async (userMessage, conversationHistory = []) => {
  // Try different model names in order of preference
  const modelNames = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-pro',
    'gemini-pro-latest'
  ];

  // Build conversation context
  let prompt = `${SYSTEM_PROMPT}\n\nConversation history:\n`;
  
  // Add conversation history for context
  if (conversationHistory && conversationHistory.length > 0) {
    conversationHistory.forEach(msg => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      prompt += `${role}: ${msg.content}\n`;
    });
  }
  
  // Add current user message
  prompt += `\nUser: ${userMessage}\n\nAssistant (respond as a compassionate therapist with specific guidance):`;

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

