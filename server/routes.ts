import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Update user persona
  app.post("/api/user/persona", async (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const user = await storage.updateUser(req.user.id, {
      persona: req.body.persona
    });

    res.json(user);
  });

  // Get pathways
  app.get("/api/pathways", async (req, res) => {
    const pathways = await storage.getPathways();
    res.json(pathways);
  });

  // Get tools
  app.get("/api/tools", async (req, res) => {
    const tools = await storage.getTools();
    res.json(tools);
  });

  // Writing feedback endpoint
  app.post("/api/writing-feedback", async (req, res) => {
    try {
      const { step, content: inputContent } = req.body;

      let prompt = '';
      let responseFormat = '';

      switch (step) {
        case 'ideas':
          prompt = `Analyze these content ideas for an AI safety article:\n${inputContent.ideas.join('\n')}\n\nProvide feedback on:\n1. Relevance to AI safety\n2. Potential impact\n3. Suggestions for improvement`;
          responseFormat = '{ "ideas": ["suggestion1", "suggestion2", ...] }';
          break;

        case 'audience':
          prompt = `Review this audience analysis for an AI safety article:\nCurrent Understanding: ${inputContent.understanding}\nExcluded Topics: ${inputContent.notExplaining}\nInterest Factors: ${inputContent.interest}\nTakeaways: ${inputContent.takeaways}\n\nProvide structured feedback on the analysis.`;
          responseFormat = '{ "audience": { "suggestions": ["point1", ...], "improvements": ["improvement1", ...] } }';
          break;

        case 'headlines':
          prompt = `Review these headlines for an AI safety article:\n${inputContent.headlines.join('\n')}\n\nThe main idea is: ${inputContent.selectedIdea}\n\nAnalyze for clarity, specificity, and appeal. Suggest improvements.`;
          responseFormat = '{ "headlines": ["suggestion1", "suggestion2", ...] }';
          break;

        case 'story':
          prompt = `Review this story structure for an AI safety article:\nMain Story: ${inputContent.mainStory}\nPromise Fulfillment: ${inputContent.fulfillment}\nReader Journey: ${inputContent.journey}\n\nProvide feedback on narrative flow and engagement.`;
          responseFormat = '{ "story": { "structure": ["point1", ...], "improvements": ["improvement1", ...] } }';
          break;

        case 'outline':
          prompt = `Review this article outline:\nHeadline: ${inputContent.headline}\nMain Points:\n${inputContent.points.join('\n')}\nConclusion: ${inputContent.conclusion}\n\nAnalyze structure and flow, suggest improvements.`;
          responseFormat = '{ "outline": { "suggestions": ["suggestion1", ...], "flow": ["improvement1", ...] } }';
          break;

        default:
          throw new Error('Invalid feedback step');
      }

      const completion = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${prompt}\n\nProvide feedback in this exact JSON format:\n${responseFormat}`
          }
        ],
        model: 'claude-3-opus-20240229',
        system: 'You are an expert writing coach specializing in AI safety content. Provide specific, actionable feedback.',
      });

      // Extract the first content block text
      const messageContent = completion.content[0].text || '';

      // Extract JSON from the response text
      const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const feedbackContent = JSON.parse(jsonMatch[0]);
      res.json(feedbackContent);
    } catch (error: any) {
      console.error('Writing feedback error:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate writing feedback'
      });
    }
  });

  // Content localization endpoint
  app.post("/api/localize", async (req, res) => {
    try {
      const { nodeTitle, nodeDescription, context } = req.body;

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

The response MUST follow this exact JSON format:
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

      const completion = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'claude-3-opus-20240229',
        system: 'You are a regional AI safety education expert. Always respond with valid JSON.',
      });

      // Extract the first content block text
      const messageContent = completion.content[0].text || '';

      // Extract JSON from the response text
      const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const responseContent = JSON.parse(jsonMatch[0]);

      // Validate response structure
      if (!responseContent.resources || !Array.isArray(responseContent.resources)) {
        throw new Error('Invalid response format: missing resources array');
      }

      res.json(responseContent);
    } catch (error: any) {
      console.error('Localization error:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate localized content'
      });
    }
  });

  // Career path suggestions endpoint
  app.post("/api/career-suggestions", async (req, res) => {
    try {
      const { currentRole, yearsExperience, background, skills, interests } = req.body;

      const prompt = `As an AI safety career advisor, analyze this professional's background and suggest 3 possible career trajectories in AI safety:

Current Role: ${currentRole}
Years of Experience: ${yearsExperience}
Background: ${background}
Skills: ${skills}
AI Safety Interests: ${interests}

Please provide career suggestions in this JSON format:
{
  "suggestions": [
    {
      "role": "string",
      "type": "full-time|part-time",
      "reasoning": ["reason1", "reason2", "reason3"],
      "trajectory": {
        "startingPoint": "string",
        "intermediateStep": "string",
        "targetRole": "string"
      },
      "resources": [
        {
          "name": "string",
          "url": "string",
          "type": "remote|regional",
          "description": "string"
        }
      ]
    }
  ]
}

For each career path:
1. Focus on roles that leverage their current skills and experience
2. Provide three specific reasons why they would excel in this path
3. Include 2 relevant resources (mix of remote and regional) that can help them get started
4. Ensure resources are specific and actionable (e.g., courses, communities, organizations)`;

      const completion = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'claude-3-opus-20240229',
        system: 'You are an expert AI safety career advisor. Focus on practical, actionable suggestions.',
      });

      // Extract the first content block text
      const messageContent = completion.content[0].text || '';

      // Extract JSON from the response text
      const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const suggestions = JSON.parse(jsonMatch[0]);

      // Validate response structure
      if (!suggestions.suggestions || !Array.isArray(suggestions.suggestions)) {
        throw new Error('Invalid response format: missing suggestions array');
      }

      res.json(suggestions);
    } catch (error: any) {
      console.error('Career suggestions error:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate career suggestions'
      });
    }
  });

  // Add this new endpoint after the existing ones
  app.post("/api/analyze-background", async (req, res) => {
    try {
      const { background } = req.body;

      const prompt = `Analyze this professional background and suggest the most appropriate persona for AI safety learning:
"${background}"

Choose one of these personas and explain why:
1. technical (for those with strong technical/mathematical backgrounds)
2. policymaker (for those interested in governance and policy)
3. researcher (for those with research/academic backgrounds)

Response format must be JSON:
{
  "persona": "technical|policymaker|researcher",
  "role": "brief role description",
  "reasoning": "explanation for the chosen persona"
}`;

      const completion = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'claude-3-opus-20240229',
        system: 'You are an AI safety education advisor. Map learners to the most suitable learning path.',
      });

      // Extract the first content block text
      const messageContent = completion.content[0].text || '';

      // Extract JSON from the response text
      const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const analysis = JSON.parse(jsonMatch[0]);

      // Validate response structure
      if (!analysis.persona || !analysis.role || !analysis.reasoning) {
        throw new Error('Invalid response format');
      }

      res.json(analysis);
    } catch (error: any) {
      console.error('Background analysis error:', error);
      res.status(500).json({
        error: error.message || 'Failed to analyze background'
      });
    }
  });

  // Add this new endpoint after existing endpoints
  app.post("/api/customize-course", async (req, res) => {
    try {
      const { background } = req.body;

      const prompt = `Given a learner with this background: "${background}", customize these AI Impact course units:

1. Understanding AI Systems
2. AI Impact on Society
3. Future of AI and Safety

For each unit, provide:
- A customized title that relates to their background
- A description that connects the topic to their field
- Specific examples from their domain
- Learning outcomes relevant to their expertise

Response format must be JSON:
{
  "units": [
    {
      "title": "string",
      "description": "string",
      "examples": ["string"],
      "outcomes": ["string"]
    }
  ]
}`;

      const completion = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'claude-3-opus-20240229',
        system: 'You are an AI education expert specializing in personalizing learning paths.',
      });

      // Extract the first content block text
      const messageContent = completion.content[0].text || '';

      // Extract JSON from the response text
      const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const customizedContent = JSON.parse(jsonMatch[0]);

      // Validate response structure
      if (!customizedContent.units || !Array.isArray(customizedContent.units)) {
        throw new Error('Invalid response format');
      }

      res.json(customizedContent);
    } catch (error: any) {
      console.error('Course customization error:', error);
      res.status(500).json({
        error: error.message || 'Failed to customize course content'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}