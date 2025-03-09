import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",  // Adjust if needed
  dangerouslyAllowBrowser: true // Enable browser-side API calls
});

export type LocalizationContext = {
  region: string;
  background: string;
  experience: string;
  interests: string;
};

export async function generateLocalizedResources(
  nodeTitle: string,
  nodeDescription: string,
  context: LocalizationContext
) {
  const prompt = `Given an AI safety learning resource:
Title: ${nodeTitle}
Description: ${nodeDescription}

Generate region-specific resources and adaptations for a learner with the following context:
Region: ${context.region}
Background: ${context.background}
Experience Level: ${context.experience}
Interests: ${context.interests}

Please provide a JSON response with:
1. Localized resources (papers, courses, organizations)
2. Regional case studies
3. Cultural context adaptations

Format the response as:
{
  "resources": [
    {
      "title": "string",
      "type": "paper|course|organization",
      "url": "string",
      "description": "string"
    }
  ],
  "caseStudies": [
    {
      "title": "string",
      "description": "string",
      "region": "string"
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",  // Using DeepSeek's chat model
      messages: [
        { role: "system", content: "You are a regional AI safety education expert." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500, // Limit response size
      temperature: 0.7 // Add some variability but keep it focused
    });

    if (!response.choices[0].message.content) {
      throw new Error('Empty response from API');
    }

    const content = JSON.parse(response.choices[0].message.content);

    // Validate response structure
    if (!content.resources || !Array.isArray(content.resources)) {
      throw new Error('Invalid response format: missing resources array');
    }

    return content;
  } catch (error: any) {
    console.error('Error generating localized resources:', error);
    if (error.status === 402) {
      throw new Error('API rate limit exceeded. Please try again later.');
    } else if (error.status === 401) {
      throw new Error('API authentication failed. Please check your API key.');
    }
    throw new Error(error.message || 'Failed to generate localized content');
  }
}