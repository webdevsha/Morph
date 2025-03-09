import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
