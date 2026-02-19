const OpenAI = require('openai');

/**
 * Analyzes the ticket description using OpenAI to suggest category and priority.
 * Fails gracefully if API key is missing or request errors.
 * 
 * @param {string} description - The ticket description from the user
 * @returns {Promise<Object>} - { suggested_category, suggested_priority }
 */
const classifyTicket = async (description) => {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("OPENAI_API_KEY not found. Returning mock classification.");
        return {
            suggested_category: 'general',
            suggested_priority: 'medium',
        };
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
    Analyze the following support ticket description and suggest a category and priority.
    
    Category choices: billing, technical, account, general.
    Priority choices: low, medium, high, critical.
    
    Description: "${description}"
    
    Return ONLY a JSON object with keys "suggested_category" and "suggested_priority".
    Example: {"suggested_category": "technical", "suggested_priority": "high"}
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        });

        const content = response.choices[0].message.content;
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}') + 1;
        const jsonString = content.substring(jsonStart, jsonEnd);

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("LLM Error:", error);
        // Fallback on error
        return {
            suggested_category: 'general',
            suggested_priority: 'medium',
        };
    }
};

module.exports = { classifyTicket };
