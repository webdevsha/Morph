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

  // New endpoint for content localization
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

      if (!completion.content[0].text) {
        throw new Error('Empty response from API');
      }

      // Extract JSON from the response text
      const jsonMatch = completion.content[0].text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const content = JSON.parse(jsonMatch[0]);

      // Validate response structure
      if (!content.resources || !Array.isArray(content.resources)) {
        throw new Error('Invalid response format: missing resources array');
      }

      res.json(content);
    } catch (error: any) {
      console.error('Localization error:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate localized content'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}