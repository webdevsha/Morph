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
      "description": "string",
      "relevance": "string"
    }
  ],
  "caseStudies": [
    {
      "title": "string",
      "description": "string",
      "region": "string"
    }
  ],
  "culturalContext": {
    "adaptations": ["string"],
    "considerations": ["string"]
  }
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { role: "system", content: "You are an AI safety education expert with deep knowledge of regional contexts and cultural considerations." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error('Empty response from API');
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating localized resources:', error);
    throw error;
  }
}